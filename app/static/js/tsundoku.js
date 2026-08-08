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

  const state = {
    story: stories[0] || null,
    displayMode: pref('displayMode', 'furigana'),
    translationMode: pref('translationMode', 'natural'),
    translationLanguage: pref('translationLanguage', pageLang),
    colors: pref('grammarColors', 'on') !== 'off',
    sync: pref('syncScroll', 'on') !== 'off',
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
    state.story.sentences.forEach((sentence, index) => {
      const jaRow = document.createElement('div');
      jaRow.className = 'tsu-sentence';
      jaRow.dataset.sentenceId = sentence.id;
      jaRow.dataset.index = index;
      jaRow.innerHTML = `<span class="tsu-line-number">${index+1}</span><div class="tsu-sentence-text">${sentence.ja.map(jpTokenHTML).join('')}</div>`;
      const trRow = document.createElement('div');
      trRow.className = 'tsu-sentence';
      trRow.dataset.sentenceId = sentence.id;
      trRow.dataset.index = index;
      trRow.innerHTML = `<span class="tsu-line-number">${index+1}</span><div class="tsu-sentence-text">${translationHTML(sentence)}</div>`;
      [jaRow,trRow].forEach(row => row.addEventListener('click', () => focusSentence(index, true)));
      ja.appendChild(jaRow); tr.appendChild(trRow);
    });
    attachTokenRelations();
    focusSentence(state.activeSentence, false);
  }

  function holdSyncLock(milliseconds = 100) {
    state.syncLock = true;
    if (state.syncUnlockTimer) clearTimeout(state.syncUnlockTimer);
    state.syncUnlockTimer = setTimeout(() => {
      state.syncLock = false;
      state.syncUnlockTimer = null;
    }, milliseconds);
  }

  function focusSentence(index, align = true) {
    if (!state.story) return;
    state.activeSentence = Math.max(0, Math.min(index, state.story.sentences.length - 1));
    $$('.tsu-sentence').forEach((row) => row.classList.toggle('active', Number(row.dataset.index) === state.activeSentence));
    if (align) {
      // A sentence click is authoritative: place BOTH panes at the same sentence
      // immediately. Smooth scrolling was vulnerable to being cancelled/reinterpreted
      // by the paired scroll listeners, especially when returning to sentence 1.
      holdSyncLock(80);
      ['[data-ja-sentences]','[data-translation-sentences]'].forEach((selector) => {
        const pane = $(selector);
        const row = pane.querySelector(`[data-index="${state.activeSentence}"]`);
        if (!row) return;
        const maxScroll = Math.max(0, pane.scrollHeight - pane.clientHeight);
        let top;
        if (state.activeSentence === 0) top = 0;
        else if (state.activeSentence === state.story.sentences.length - 1) top = maxScroll;
        else top = Math.max(0, Math.min(maxScroll, row.offsetTop - pane.clientHeight * .22));
        pane.scrollTop = top;
      });
      // Re-assert once after layout/paint. This catches ruby/font-height adjustments
      // without starting a second animated scroll.
      requestAnimationFrame(() => {
        ['[data-ja-sentences]','[data-translation-sentences]'].forEach((selector) => {
          const pane = $(selector);
          const row = pane.querySelector(`[data-index="${state.activeSentence}"]`);
          if (!row) return;
          const maxScroll = Math.max(0, pane.scrollHeight - pane.clientHeight);
          const top = state.activeSentence === 0 ? 0 :
            state.activeSentence === state.story.sentences.length - 1 ? maxScroll :
            Math.max(0, Math.min(maxScroll, row.offsetTop - pane.clientHeight * .22));
          pane.scrollTop = top;
        });
      });
    }
    const progress = writeProgress(state.story, state.activeSentence);
    updateProgress(progress);
    renderInsight();
    renderBookshelf();
  }

  function renderInsight() {
    const sentence = state.story?.sentences[state.activeSentence];
    const target = $('[data-insight]');
    if (!sentence || !target) return;
    const jpPlain = sentence.ja.map((token) => token.text).join('');
    const roles = [...new Set(sentence.ja.map(t => t.role).filter(r => r && !['punctuation'].includes(r)))].slice(0,5);
    target.innerHTML = `<div class="tsu-insight-main">${jpPlain}</div><div class="tsu-role-chips">${roles.map(r => `<span class="tsu-role-chip">${roleLabels[pageLang][r] || r}</span>`).join('')}</div><p class="tsu-insight-note">${pageLang === 'es' ? 'Pasa el cursor sobre una palabra coloreada para resaltar su relación conceptual en ambos idiomas.' : 'Hover a colored word to highlight its conceptual relationship across both languages.'}</p>`;
  }

  function updateProgress(progress = loadProgress(state.story)) {
    const total = state.story?.sentences.length || 0;
    const pct = progress.completion || 0;
    $('[data-progress-bar]').style.width = `${pct}%`;
    $('[data-progress-percent]').textContent = `${pct}%`;
    $('[data-progress-count]').textContent = `${state.activeSentence + 1} / ${total} ${pageLang === 'es' ? 'oraciones' : 'sentences'}`;
  }

  function updateControls() {
    $$('[data-display-mode]').forEach(b => b.classList.toggle('active', b.dataset.displayMode === state.displayMode));
    $$('[data-translation-mode]').forEach(b => b.classList.toggle('active', b.dataset.translationMode === state.translationMode));
    $$('[data-translation-language]').forEach(b => b.classList.toggle('active', b.dataset.translationLanguage === state.translationLanguage));
    const colorButton = $('[data-color-toggle]'); colorButton.classList.toggle('active', state.colors); colorButton.setAttribute('aria-pressed', String(state.colors));
    const syncButton = $('[data-sync-toggle]'); syncButton.classList.toggle('active', state.sync); syncButton.setAttribute('aria-pressed', String(state.sync));
    root.classList.toggle('colors-off', !state.colors);
    $('[data-translation-heading]').textContent = state.translationLanguage === 'es' ? 'Español' : 'English';
  }

  function selectStory(id) {
    const story = stories.find(s => s.id === id); if (!story) return;
    state.story = story;
    const p = loadProgress(story);
    const index = Math.max(0, story.sentences.findIndex(s => s.id === p.last_sentence));
    state.activeSentence = index < 0 ? 0 : index;
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
  $('[data-prev]').addEventListener('click', () => focusSentence(state.activeSentence - 1, true));
  $('[data-next]').addEventListener('click', () => focusSentence(state.activeSentence + 1, true));
  $('[data-bookmark]').addEventListener('click', () => {
    if (!state.story) return; const p = loadProgress(state.story); p.bookmark = state.story.sentences[state.activeSentence].id;
    try { localStorage.setItem(progressKey(state.story), JSON.stringify(p)); } catch (_) {}
    $('[data-bookmark]').textContent = `★ ${pageLang === 'es' ? 'Oración guardada' : 'Sentence bookmarked'}`;
    setTimeout(() => $('[data-bookmark]').textContent = `☆ ${pageLang === 'es' ? 'Guardar oración' : 'Bookmark sentence'}`, 1400);
  });

  if (state.story) selectStory(state.story.id);
  else $('.tsu-reader').innerHTML = `<p style="padding:2rem">${pageLang === 'es' ? 'No hay lecturas publicadas todavía.' : 'No published readings yet.'}</p>`;
})();
