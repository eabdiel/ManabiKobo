/* Tsundoku Reading Nook — structured bilingual reading runtime */
(() => {
  const root = document.querySelector('[data-tsundoku-root]');
  if (!root) return;

  const catalog = JSON.parse(root.dataset.catalog || '{"stories":[]}');
  const stories = catalog.stories || [];
  const pageLang = document.body.dataset.lang === 'es' ? 'es' : 'en';
  const $ = (selector) => root.querySelector(selector);
  const $$ = (selector) => [...root.querySelectorAll(selector)];
  const pref = (name, fallback) => {
    try { return localStorage.getItem(`mk.reader.${name}`) || fallback; } catch (_) { return fallback; }
  };
  const savePref = (name, value) => { try { localStorage.setItem(`mk.reader.${name}`, value); } catch (_) {} };

  // v1.0.2 changes synchronized scrolling from opt-out to opt-in. Apply the
  // new OFF default once even for browsers that retained the earlier POC's
  // ON preference; after this migration, the user's own toggle choice persists.
  try {
    if (!localStorage.getItem('mk.reader.syncOptInV1')) {
      localStorage.setItem('mk.reader.syncScroll', 'off');
      localStorage.setItem('mk.reader.syncOptInV1', '1');
    }
  } catch (_) {}

  const state = {
    story: stories[0] || null,
    displayMode: pref('displayMode', 'furigana'),
    translationMode: pref('translationMode', 'natural'),
    translationLanguage: pref('translationLanguage', pageLang),
    colors: pref('grammarColors', 'on') !== 'off',
    sync: pref('syncScroll', 'off') === 'on',
    sentencesPerReading: Math.max(1, Math.min(10, parseInt(pref('sentencesPerReading', '1'), 10) || 1)),
    activeSentence: 0,
    syncLock: false,
    syncUnlockTimer: null,
    programmaticScroll: null,
  };

  const roleLabels = {
    en: {subject:'Subject',object:'Object',verb:'Verb',particle:'Particle',technical:'Technical term',connector:'Connector',adjective:'Adjective',adverb:'Adverb',time:'Time',place:'Place',expression:'Expression'},
    es: {subject:'Sujeto',object:'Objeto',verb:'Verbo',particle:'Partícula',technical:'Término técnico',connector:'Conector',adjective:'Adjetivo',adverb:'Adverbio',time:'Tiempo',place:'Lugar',expression:'Expresión'}
  };

  function progressKey(story) { return `mk.progress.${story.id}`; }
  function loadProgress(story) {
    try { return JSON.parse(localStorage.getItem(progressKey(story)) || '{}'); } catch (_) { return {}; }
  }
  function writeProgress(story, index) {
    const total = story.sentences.length;
    const completion = total ? Math.round(((index + 1) / total) * 100) : 0;
    const prior = loadProgress(story);
    const data = {reading_id:story.id,last_sentence:story.sentences[index]?.id || '',completion:Math.max(prior.completion || 0, completion),completed:completion >= 100,last_opened:new Date().toISOString(),bookmark:prior.bookmark || ''};
    try { localStorage.setItem(progressKey(story), JSON.stringify(data)); } catch (_) {}
    return data;
  }

  function renderBookshelf() {
    const list = $('[data-book-list]');
    list.innerHTML = '';
    stories.forEach((story) => {
      const p = loadProgress(story);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = `tsu-book-card${state.story?.id === story.id ? ' active' : ''}`;
      button.dataset.storyId = story.id;
      const translated = story.title[state.translationLanguage] || story.title.en;
      button.innerHTML = `<span class="tsu-book-cover">積</span><span><b class="jp-title">${story.title.ja}</b><b>${translated}</b><small>${pageLang === 'es' ? 'Nivel' : 'Level'} ${story.difficulty} · ${story.estimated_minutes} min</small><span class="tsu-book-meta"><span>${story.tags.slice(0,2).join(' · ')}</span><span>${p.completion || 0}%</span></span><span class="tsu-book-progress"><i style="width:${p.completion || 0}%"></i></span></span>`;
      button.addEventListener('click', () => selectStory(story.id));
      list.appendChild(button);
    });
  }

  function jpTokenHTML(token) {
    const text = token.text || '';
    const role = token.role || '';
    const rel = token.relation || '';
    let display = text;
    if (state.displayMode === 'kana') display = token.reading || text;
    else if (state.displayMode === 'romaji') display = token.romaji || text;
    else if (token.reading && token.reading !== text && /[一-龯々]/.test(text)) display = `<ruby>${text}<rt>${token.reading}</rt></ruby>`;
    return `<span class="tsu-token" data-role="${role}" data-relation="${rel}" title="${roleLabels[pageLang][role] || role}">${display}</span>`;
  }

  function translationHTML(sentence) {
    const bundle = sentence.translation[state.translationLanguage] || sentence.translation.en;
    if (state.translationMode === 'literal') return `<span class="tsu-literal-text">${bundle.literal}</span>`;
    return (bundle.tokens || []).map((token) => `<span class="tsu-token" data-role="${token.role || ''}" data-relation="${token.relation || ''}" title="${roleLabels[pageLang][token.role] || token.role || ''}">${token.text || ''}</span>`).join('');
  }

  function attachTokenRelations() {
    $$('.tsu-token[data-relation]').forEach((token) => {
      const relation = token.dataset.relation;
      if (!relation) return;
      token.addEventListener('mouseenter', () => $$(`.tsu-token[data-relation="${CSS.escape(relation)}"]`).forEach((t) => t.classList.add('is-related')));
      token.addEventListener('mouseleave', () => $$('.tsu-token.is-related').forEach((t) => t.classList.remove('is-related')));
      token.addEventListener('click', (event) => {
        event.stopPropagation();
        const matches = $$(`.tsu-token[data-relation="${CSS.escape(relation)}"]`);
        matches.forEach((t) => t.classList.add('is-related'));
        setTimeout(() => matches.forEach((t) => t.classList.remove('is-related')), 1300);
      });
    });
  }

  function renderSentences() {
    if (!state.story) return;
    const ja = $('[data-ja-sentences]');
    const tr = $('[data-translation-sentences]');
    ja.innerHTML = '';
    tr.innerHTML = '';

    const groupSize = state.sentencesPerReading;
    for (let startIndex = 0; startIndex < state.story.sentences.length; startIndex += groupSize) {
      const group = state.story.sentences.slice(startIndex, startIndex + groupSize);
      const endIndex = startIndex + group.length - 1;
      const rangeLabel = group.length === 1 ? `${startIndex + 1}` : `${startIndex + 1}–${endIndex + 1}`;

      const jaRow = document.createElement('div');
      jaRow.className = 'tsu-sentence';
      jaRow.dataset.sentenceId = group[0].id;
      jaRow.dataset.index = startIndex;
      jaRow.dataset.endIndex = endIndex;
      jaRow.innerHTML = `<span class="tsu-line-number">${rangeLabel}</span><div class="tsu-sentence-text tsu-reading-group">${group.map((sentence) => `<span class="tsu-group-sentence" data-source-sentence-id="${sentence.id}">${sentence.ja.map(jpTokenHTML).join('')}</span>`).join('')}</div>`;

      const trRow = document.createElement('div');
      trRow.className = 'tsu-sentence';
      trRow.dataset.sentenceId = group[0].id;
      trRow.dataset.index = startIndex;
      trRow.dataset.endIndex = endIndex;
      trRow.innerHTML = `<span class="tsu-line-number">${rangeLabel}</span><div class="tsu-sentence-text tsu-reading-group">${group.map((sentence) => `<span class="tsu-group-sentence" data-source-sentence-id="${sentence.id}">${translationHTML(sentence)}</span>`).join('')}</div>`;

      [jaRow, trRow].forEach((row) => row.addEventListener('click', () => focusSentence(startIndex, true)));
      ja.appendChild(jaRow);
      tr.appendChild(trRow);
    }
    attachTokenRelations();
    focusSentence(state.activeSentence, false, false);
  }

  function holdSyncLock(milliseconds = 100) {
    state.syncLock = true;
    if (state.syncUnlockTimer) clearTimeout(state.syncUnlockTimer);
    state.syncUnlockTimer = setTimeout(() => {
      state.syncLock = false;
      state.syncUnlockTimer = null;
    }, milliseconds);
  }

  function focusSentence(index, align = true, recordProgress = true) {
    if (!state.story) return;
    const maxIndex = Math.max(0, state.story.sentences.length - 1);
    const requested = Math.max(0, Math.min(index, maxIndex));
    state.activeSentence = Math.floor(requested / state.sentencesPerReading) * state.sentencesPerReading;
    const activeEnd = Math.min(maxIndex, state.activeSentence + state.sentencesPerReading - 1);

    $$('.tsu-sentence').forEach((row) => row.classList.toggle('active', Number(row.dataset.index) === state.activeSentence));
    if (align) {
      holdSyncLock(80);
      ['[data-ja-sentences]','[data-translation-sentences]'].forEach((selector) => {
        const pane = $(selector);
        const row = pane.querySelector(`[data-index="${state.activeSentence}"]`);
        if (!row) return;
        const maxScroll = Math.max(0, pane.scrollHeight - pane.clientHeight);
        let top;
        if (state.activeSentence === 0) top = 0;
        else if (activeEnd === maxIndex) top = maxScroll;
        else top = Math.max(0, Math.min(maxScroll, row.offsetTop - pane.clientHeight * .22));
        pane.scrollTop = top;
      });
      requestAnimationFrame(() => {
        ['[data-ja-sentences]','[data-translation-sentences]'].forEach((selector) => {
          const pane = $(selector);
          const row = pane.querySelector(`[data-index="${state.activeSentence}"]`);
          if (!row) return;
          const maxScroll = Math.max(0, pane.scrollHeight - pane.clientHeight);
          const top = state.activeSentence === 0 ? 0 :
            activeEnd === maxIndex ? maxScroll :
            Math.max(0, Math.min(maxScroll, row.offsetTop - pane.clientHeight * .22));
          pane.scrollTop = top;
        });
      });
    }

    const progress = recordProgress ? writeProgress(state.story, activeEnd) : loadProgress(state.story);
    updateProgress(progress);
    renderInsight();
    renderBookshelf();
  }

  function renderInsight() {
    const target = $('[data-insight]');
    if (!state.story || !target) return;
    const group = state.story.sentences.slice(state.activeSentence, state.activeSentence + state.sentencesPerReading);
    if (!group.length) return;
    const jpPlain = group.map(sentence => sentence.ja.map((token) => token.text).join('')).join(' ');
    const roles = [...new Set(group.flatMap(sentence => sentence.ja.map(t => t.role)).filter(r => r && !['punctuation'].includes(r)))].slice(0,5);
    target.innerHTML = `<div class="tsu-insight-main">${jpPlain}</div><div class="tsu-role-chips">${roles.map(r => `<span class="tsu-role-chip">${roleLabels[pageLang][r] || r}</span>`).join('')}</div><p class="tsu-insight-note">${pageLang === 'es' ? 'Pasa el cursor sobre una palabra coloreada para resaltar su relación conceptual en ambos idiomas.' : 'Hover a colored word to highlight its conceptual relationship across both languages.'}</p>`;
  }

  function updateProgress(progress = loadProgress(state.story)) {
    const total = state.story?.sentences.length || 0;
    const pct = progress.completion || 0;
    const end = Math.min(total, state.activeSentence + state.sentencesPerReading);
    const range = end > state.activeSentence + 1 ? `${state.activeSentence + 1}–${end}` : `${state.activeSentence + 1}`;
    $('[data-progress-bar]').style.width = `${pct}%`;
    $('[data-progress-percent]').textContent = `${pct}%`;
    $('[data-progress-count]').textContent = `${range} / ${total} ${pageLang === 'es' ? 'oraciones' : 'sentences'}`;
  }

  function updateControls() {
    $$('[data-display-mode]').forEach(b => b.classList.toggle('active', b.dataset.displayMode === state.displayMode));
    $$('[data-translation-mode]').forEach(b => b.classList.toggle('active', b.dataset.translationMode === state.translationMode));
    $$('[data-translation-language]').forEach(b => b.classList.toggle('active', b.dataset.translationLanguage === state.translationLanguage));
    const colorButton = $('[data-color-toggle]'); colorButton.classList.toggle('active', state.colors); colorButton.setAttribute('aria-pressed', String(state.colors));
    const syncButton = $('[data-sync-toggle]'); syncButton.classList.toggle('active', state.sync); syncButton.setAttribute('aria-pressed', String(state.sync));
    const countInput = $('[data-sentences-per-reading]'); if (countInput) countInput.value = String(state.sentencesPerReading);
    root.classList.toggle('colors-off', !state.colors);
    $('[data-translation-heading]').textContent = state.translationLanguage === 'es' ? 'Español' : 'English';
  }

  function selectStory(id) {
    const story = stories.find(s => s.id === id); if (!story) return;
    state.story = story;
    const p = loadProgress(story);
    const index = Math.max(0, story.sentences.findIndex(s => s.id === p.last_sentence));
    state.activeSentence = Math.floor((index < 0 ? 0 : index) / state.sentencesPerReading) * state.sentencesPerReading;
    $('[data-reading-title]').textContent = story.title.ja;
    $('[data-reading-subtitle]').textContent = `${story.title[state.translationLanguage] || story.title.en} · ${pageLang === 'es' ? 'Nivel' : 'Level'} ${story.difficulty} · ${story.estimated_minutes} min`;
    renderBookshelf(); renderSentences(); updateProgress(p); updateControls();
  }

  function synchronize(source, target) {
    if (!state.sync || state.syncLock) return;
    const rows = [...source.querySelectorAll('.tsu-sentence')];
    if (!rows.length) return;

    // Edge-aware synchronization. At the very top, the normal 32% viewport
    // anchor sits several rows below sentence 1. That made a completed smooth
    // scroll back to sentence 1 immediately look like sentence 3/4 was the
    // active anchor and pulled the opposite pane back toward the middle.
    // Keep both panes explicitly pinned to their shared edges instead.
    const topThreshold = 24;
    const bottomThreshold = 24;
    const sourceMax = Math.max(0, source.scrollHeight - source.clientHeight);
    const targetMax = Math.max(0, target.scrollHeight - target.clientHeight);

    if (source.scrollTop <= topThreshold) {
      // Do not hold the global lock here. A user may actively move the opposite pane
      // immediately afterward; suppressing those events caused the two panes to stay
      // split (line 1 vs line 4). Setting an already-top pane to 0 is idempotent.
      target.scrollTop = 0;
      return;
    }

    if (sourceMax - source.scrollTop <= bottomThreshold) {
      target.scrollTop = targetMax;
      return;
    }

    const anchor = source.scrollTop + source.clientHeight * .32;
    let closest = rows[0]; let distance = Infinity;
    rows.forEach(row => { const d = Math.abs(row.offsetTop - anchor); if (d < distance) { distance = d; closest = row; } });
    const counterpart = target.querySelector(`[data-sentence-id="${closest.dataset.sentenceId}"]`);
    if (!counterpart) return;
    holdSyncLock(100);
    target.scrollTop = Math.max(0, counterpart.offsetTop - target.clientHeight * .32);
  }

  const jaPane = $('[data-ja-sentences]'), trPane = $('[data-translation-sentences]');
  jaPane.addEventListener('scroll', () => synchronize(jaPane, trPane), {passive:true});
  trPane.addEventListener('scroll', () => synchronize(trPane, jaPane), {passive:true});

  $$('[data-display-mode]').forEach(button => button.addEventListener('click', () => { state.displayMode = button.dataset.displayMode; savePref('displayMode', state.displayMode); updateControls(); renderSentences(); }));
  $$('[data-translation-mode]').forEach(button => button.addEventListener('click', () => { state.translationMode = button.dataset.translationMode; savePref('translationMode', state.translationMode); updateControls(); renderSentences(); }));
  $$('[data-translation-language]').forEach(button => button.addEventListener('click', () => { state.translationLanguage = button.dataset.translationLanguage; savePref('translationLanguage', state.translationLanguage); updateControls(); selectStory(state.story.id); }));
  $('[data-color-toggle]').addEventListener('click', () => { state.colors = !state.colors; savePref('grammarColors', state.colors ? 'on' : 'off'); updateControls(); });
  $('[data-sync-toggle]').addEventListener('click', () => { state.sync = !state.sync; savePref('syncScroll', state.sync ? 'on' : 'off'); updateControls(); });
  const sentenceCountInput = $('[data-sentences-per-reading]');
  if (sentenceCountInput) {
    const applySentenceCount = () => {
      const next = Math.max(1, Math.min(10, parseInt(sentenceCountInput.value, 10) || 1));
      sentenceCountInput.value = String(next);
      if (next === state.sentencesPerReading) return;
      state.sentencesPerReading = next;
      savePref('sentencesPerReading', String(next));
      state.activeSentence = Math.floor(state.activeSentence / next) * next;
      renderSentences();
      updateControls();
    };
    sentenceCountInput.addEventListener('change', applySentenceCount);
    sentenceCountInput.addEventListener('blur', applySentenceCount);
  }
  $('[data-prev]').addEventListener('click', () => focusSentence(state.activeSentence - state.sentencesPerReading, true));
  $('[data-next]').addEventListener('click', () => focusSentence(state.activeSentence + state.sentencesPerReading, true));
  $('[data-bookmark]').addEventListener('click', () => {
    if (!state.story) return; const p = loadProgress(state.story); p.bookmark = state.story.sentences[state.activeSentence].id;
    try { localStorage.setItem(progressKey(state.story), JSON.stringify(p)); } catch (_) {}
    $('[data-bookmark]').textContent = `★ ${pageLang === 'es' ? 'Lectura guardada' : 'Reading bookmarked'}`;
    setTimeout(() => $('[data-bookmark]').textContent = `☆ ${pageLang === 'es' ? 'Guardar lectura' : 'Bookmark reading'}`, 1400);
  });

  if (state.story) selectStory(state.story.id);
  else $('.tsu-reader').innerHTML = `<p style="padding:2rem">${pageLang === 'es' ? 'No hay lecturas publicadas todavía.' : 'No published readings yet.'}</p>`;
})();
