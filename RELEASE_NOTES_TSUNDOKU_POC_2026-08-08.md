# Manabi Kōbō — Tsundoku Reading Nook POC
## 2026-08-08 local-test build

### Scope
Adds the initial Tsundoku / Reading Nook application to the current Manabi Kōbō baseline using structured reading content and the site's professional theme tokens.

### User-facing changes
- Added **Tsundoku Reading Nook** under **Practice & Tools**.
- Moved **Kana Dojo** from Learn to **Practice & Tools**.
- Added Tsundoku to the Home **Complete Tool Catalog**.
- Upgraded Complete Tool Catalog cards to use the shared movable/resizable/minimizable home workbench behavior.
- Added the first bilingual reading: **開発者の一日 / A Day in the Life of a Developer / Un día en la vida de un desarrollador**.
- Added Furigana / Kana / Romaji Japanese display modes.
- Added Natural / Literal translation modes.
- Added English / Español translation switching.
- Added theme-derived semantic grammar colors across Japanese and translated text.
- Added sentence-to-sentence focus highlighting and token relationship highlighting.
- Added sentence-anchor synchronized scrolling between Japanese and translation panes.
- Added browser-local reading preferences, progress, and sentence bookmarking.

### Content/state architecture
Reading content is stored under `app/content/readings/` and loaded through a manifest. User state remains in separate localStorage namespaces (`mk.reader.*`, `mk.progress.*`, existing `mk:v8:layout:*`) so adding new stories does not reset saved layouts or reader progress.

### Modified files
- `app/data/pages.py`
- `app/routes/core.py`
- `app/static/css/app.css`
- `app/static/js/workbench-core.js`
- `app/templates/home.html`

### New files/directories
- `app/content/readings/readings-manifest.json`
- `app/content/readings/workplace/developer-day-001.json`
- `app/services/reading_content_service.py`
- `app/static/css/tsundoku.css`
- `app/static/js/tsundoku.js`
- `app/templates/tsundoku.html`
- `RELEASE_NOTES_TSUNDOKU_POC_2026-08-08.md`

### Validation performed
- Python source compilation: PASS (`python -m compileall`)
- Reading manifest/story JSON parsing: PASS
- Tsundoku JavaScript syntax check: PASS (`node --check`)
- Shared workbench JavaScript syntax check: PASS (`node --check`)
- Full Flask route/render smoke test was not executed in the artifact sandbox because Flask is not installed in the runtime and package installation is offline. Please run the normal local baseline startup/test flow before Git/Cloud deployment.

### Suggested local checks
1. Open `/en/` and `/es/`; confirm Tsundoku appears in Complete Tool Catalog.
2. Drag and resize the Tsundoku catalog tile; click Save; refresh and confirm layout persistence.
3. Confirm Kana Dojo and Tsundoku both appear under Practice & Tools.
4. Open `/en/tsundoku/` and `/es/tsundoku/`.
5. Exercise Furigana/Kana/Romaji, Natural/Literal, and English/Español controls.
6. Click corresponding sentences and hover colored tokens on both sides.
7. Scroll either reading pane and verify sentence-anchor synchronization.
8. Refresh and verify reader preferences/progress persist.
