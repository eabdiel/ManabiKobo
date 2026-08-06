/* Manabi Kōbō shared workbench foundation v1.1
   Adds consistent two-dimensional resizing and size persistence to every tile. */
(() => {
  const adapters = [
    ['.native-canvas','[data-native-tile]','.native-tile-toolbar','.native-drag-handle','.native-minimize'],
    ['.study-canvas','[data-study-tile]','.study-tile-toolbar','.study-drag-handle','.study-minimize'],
    ['.phrase-canvas','[data-phrase-tile]','.phrase-tile-toolbar','.phrase-drag-handle','.phrase-minimize'],
    ['.tracker-canvas','[data-tracker-tile]','.tracker-tile-toolbar','.tracker-drag-handle','.tracker-minimize'],
    ['.kana-practice-grid','[data-kana-tile]','.kana-tile-toolbar','.kana-drag-handle','.kana-minimize']
  ];

  adapters.forEach(([canvasSelector,tileSelector,toolbarSelector,dragSelector,minimizeSelector],canvasType) => {
    document.querySelectorAll(canvasSelector).forEach((canvas, canvasIndex) => {
      canvas.dataset.mkCanvas = canvas.dataset.mkCanvas || `${canvasType}-${canvasIndex}`;
      canvas.querySelectorAll(`:scope > ${tileSelector}`).forEach((tile, tileIndex) => {
        tile.dataset.mkTile = tile.dataset.mkTile || tile.dataset.nativeTile || tile.dataset.studyTile || tile.dataset.phraseTile || tile.dataset.trackerTile || tile.dataset.kanaTile || `tile-${tileIndex}`;
        const toolbar = tile.querySelector(toolbarSelector);
        if (toolbar) toolbar.dataset.mkToolbar = '';
        const drag = tile.querySelector(dragSelector);
        if (drag) drag.dataset.mkDrag = '';
        const minimize = tile.querySelector(minimizeSelector);
        if (minimize) minimize.dataset.mkMinimize = '';
        const body = [...tile.children].find(child => child !== toolbar && !child.classList.contains('mk-resize-corner'));
        if (body) body.dataset.mkBody = '';
      });
    });
  });

  const page = document.body.dataset.page || 'page';
  const lang = document.body.dataset.lang || 'en';

  document.querySelectorAll('[data-mk-canvas]').forEach((canvas, canvasIndex) => {
    const storageKey = `mk:v2:layout:${lang}:${page}:${canvas.dataset.mkCanvas || canvasIndex}`;
    const tiles = () => [...canvas.querySelectorAll(':scope > [data-mk-tile]')];

    const save = () => {
      const state = tiles().map(tile => ({
        id: tile.dataset.mkTile,
        width: tile.style.width || tile.style.flexBasis || '',
        height: tile.style.height || ''
      }));
      try { localStorage.setItem(storageKey, JSON.stringify(state)); } catch (_) {}
    };

    const restore = () => {
      let state = [];
      try { state = JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch (_) {}
      if (!Array.isArray(state)) return;
      const byId = new Map(tiles().map(tile => [tile.dataset.mkTile, tile]));
      state.forEach(item => {
        const tile = byId.get(item.id);
        if (!tile) return;
        canvas.appendChild(tile);
        if (window.innerWidth > 760) {
          if (item.width) {
            tile.style.width = item.width;
            tile.style.flexBasis = item.width;
          }
          if (item.height) tile.style.height = item.height;
        }
      });
    };

    tiles().forEach(tile => {
      let handle = tile.querySelector(':scope > .mk-resize-corner');
      if (!handle) {
        handle = document.createElement('button');
        handle.type = 'button';
        handle.className = 'mk-resize-corner';
        handle.setAttribute('aria-label', lang === 'es' ? 'Cambiar ancho y alto del panel' : 'Resize tile width and height');
        handle.title = lang === 'es' ? 'Arrastra para cambiar ancho y alto' : 'Drag to resize width and height';
        tile.appendChild(handle);
      }

      let resizeState = null;
      handle.addEventListener('pointerdown', event => {
        if (matchMedia('(max-width:760px)').matches || tile.classList.contains('is-minimized')) return;
        const rect = tile.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        resizeState = {
          pointerId: event.pointerId,
          startX: event.clientX,
          startY: event.clientY,
          startWidth: rect.width,
          startHeight: rect.height,
          maxWidth: Math.max(280, canvasRect.width - 2)
        };
        tile.classList.add('is-mk-resizing');
        handle.setPointerCapture?.(event.pointerId);
        event.preventDefault();
        event.stopPropagation();
      });

      handle.addEventListener('pointermove', event => {
        if (!resizeState) return;
        const minWidth = tile.dataset.mkTile === 'board' || tile.dataset.mkTile === 'calendar' ? 320 : 260;
        const minHeight = 130;
        const width = Math.max(minWidth, Math.min(resizeState.maxWidth, resizeState.startWidth + event.clientX - resizeState.startX));
        const height = Math.max(minHeight, resizeState.startHeight + event.clientY - resizeState.startY);
        tile.style.width = `${Math.round(width)}px`;
        tile.style.flexBasis = `${Math.round(width)}px`;
        tile.style.height = `${Math.round(height)}px`;
      });

      const finishResize = () => {
        if (!resizeState) return;
        resizeState = null;
        tile.classList.remove('is-mk-resizing');
        save();
      };
      handle.addEventListener('pointerup', finishResize);
      handle.addEventListener('pointercancel', finishResize);
    });

    canvas.addEventListener('dragend', () => setTimeout(save, 0));
    restore();

    const resetIds = ['kana-layout-reset','study-layout-reset','tracker-layout-reset','phrase-layout-reset','native-layout-reset'];
    resetIds.forEach(id => document.getElementById(id)?.addEventListener('click', () => {
      try { localStorage.removeItem(storageKey); } catch (_) {}
      tiles().forEach(tile => {
        tile.style.removeProperty('width');
        tile.style.removeProperty('height');
        tile.style.removeProperty('flex-basis');
      });
    }, {capture:true}));
  });
})();
