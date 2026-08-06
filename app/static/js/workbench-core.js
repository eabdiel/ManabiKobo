/* Manabi Kōbō shared workbench foundation v1.0 */
(() => {
  const adapters=[
    ['.native-canvas','[data-native-tile]','.native-tile-toolbar','.native-drag-handle','.native-minimize','.native-resize-handle'],
    ['.study-canvas','[data-study-tile]','.study-tile-toolbar','.study-drag-handle','.study-minimize','.study-resize-hint'],
    ['.phrase-canvas','[data-phrase-tile]','.phrase-tile-toolbar','.phrase-drag-handle','.phrase-minimize','.phrase-resize-hint'],
    ['.tracker-canvas','[data-tracker-tile]','.tracker-tile-toolbar','.tracker-drag-handle','.tracker-minimize','.tracker-resize-hint'],
    ['.kana-canvas','[data-kana-tile]','.kana-tile-toolbar','.kana-drag-handle','.kana-minimize','.kana-resize-hint']
  ];
  adapters.forEach(([canvasSel,tileSel,barSel,dragSel,minSel,resizeSel],ci)=>{document.querySelectorAll(canvasSel).forEach((c,j)=>{c.dataset.mkCanvas=c.dataset.mkCanvas||`${ci}-${j}`;c.querySelectorAll(`:scope > ${tileSel}`).forEach((t,i)=>{t.dataset.mkTile=t.dataset.mkTile||t.dataset.nativeTile||t.dataset.studyTile||t.dataset.phraseTile||t.dataset.trackerTile||t.dataset.kanaTile||`tile-${i}`;const bar=t.querySelector(barSel);if(bar)bar.dataset.mkToolbar='';const drag=t.querySelector(dragSel);if(drag)drag.dataset.mkDrag='';const min=t.querySelector(minSel);if(min)min.dataset.mkMinimize='';const resize=t.querySelector(resizeSel);if(resize)resize.classList.add('mk-resize-handle');const body=[...t.children].find(x=>x!==bar);if(body)body.dataset.mkBody='';});});});
  const page = document.body.dataset.page || 'page';
  const lang = document.body.dataset.lang || 'en';
  const canvases = [...document.querySelectorAll('[data-mk-canvas]')];
  canvases.forEach((canvas, canvasIndex) => {
    const key = `mk:v1:layout:${lang}:${page}:${canvas.dataset.mkCanvas || canvasIndex}`;
    let dragged = null, resizing = null;
    const tiles = () => [...canvas.querySelectorAll(':scope > [data-mk-tile]')];
    const save = () => localStorage.setItem(key, JSON.stringify(tiles().map(t => ({
      id:t.dataset.mkTile, width:t.style.flexBasis || '', minimized:t.classList.contains('is-minimized')
    }))));
    const restore = () => {
      try {
        const state = JSON.parse(localStorage.getItem(key) || '[]');
        const map = new Map(state.map(x => [x.id,x]));
        state.forEach(x => { const t=canvas.querySelector(`:scope > [data-mk-tile="${CSS.escape(x.id)}"]`); if(t) canvas.appendChild(t); });
        tiles().forEach(t => { const x=map.get(t.dataset.mkTile); if(x){t.style.flexBasis=x.width||'';t.classList.toggle('is-minimized',!!x.minimized);} });
      } catch(e){ console.warn('Manabi Kōbō layout restore failed',e); }
    };
    tiles().forEach((tile,i) => {
      if(!tile.dataset.mkTile) tile.dataset.mkTile = `tile-${i+1}`;
      const toolbar = tile.querySelector('[data-mk-toolbar]');
      const drag = tile.querySelector('[data-mk-drag]') || toolbar;
      const min = tile.querySelector('[data-mk-minimize]');
      const resize = tile.querySelector('.mk-resize-handle');
      if(min) min.addEventListener('click', e => { e.stopPropagation(); tile.classList.toggle('is-minimized'); min.textContent=tile.classList.contains('is-minimized')?'+':'−'; save(); });
      if(drag){ drag.draggable=true; drag.addEventListener('dragstart',e=>{dragged=tile;tile.classList.add('is-dragging');e.dataTransfer.effectAllowed='move'});drag.addEventListener('dragend',()=>{tile.classList.remove('is-dragging');dragged=null;save()}); }
      if(resize){ resize.addEventListener('pointerdown',e=>{if(matchMedia('(max-width:760px)').matches)return;resizing={tile,x:e.clientX,w:tile.getBoundingClientRect().width};resize.setPointerCapture(e.pointerId);e.preventDefault()});resize.addEventListener('pointermove',e=>{if(!resizing)return;resizing.tile.style.flexBasis=`${Math.round(Math.max(280,Math.min(canvas.clientWidth,resizing.w+e.clientX-resizing.x)))}px`});resize.addEventListener('pointerup',()=>{if(resizing)save();resizing=null}); }
    });
    canvas.addEventListener('dragover',e=>{if(!dragged)return;e.preventDefault();const target=e.target.closest('[data-mk-tile]');if(!target||target===dragged||target.parentElement!==canvas)return;const r=target.getBoundingClientRect();canvas.insertBefore(dragged,e.clientX<r.left+r.width/2?target:target.nextSibling)});
    restore();
    document.querySelectorAll(`[data-mk-reset="${canvas.dataset.mkCanvas || canvasIndex}"]`).forEach(b=>b.addEventListener('click',()=>{localStorage.removeItem(key);location.reload()}));
  });
})();
