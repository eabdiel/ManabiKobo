# Manabi Kōbō — Global Day / Night Mode
## 2026-08-08

### Summary
Added a persistent site-wide Day / Night appearance toggle while preserving the existing professional Manabi Kōbō visual identity.

### User-facing behavior
- New sun/moon control in the shared header on every page.
- Day mode remains the default for new visitors.
- Night mode changes the global shell, navigation, workbenches, study tools, Tsundoku, How-to guides, Reference Hub, and Language IDE surfaces.
- The selected appearance persists across page navigation and browser sessions using the dedicated `mk.preferences.theme` local-storage key.
- The theme preference remains separate from saved tile layouts, reading progress, and other learning state.
- Mobile users retain access to the toggle in the compact top header.
- The browser/PWA theme-color metadata updates with the selected appearance.

### Technical notes
- Theme is applied in the document head before styles render to minimize light/dark flash during navigation.
- Shared semantic tokens are overridden for night mode rather than storing per-page hard-coded palettes.
- The professional warm red/gold Manabi Kōbō palette is retained in both modes; night mode does not revive the older pink/purple experimental theme.
- Updated the service-worker shell cache to `manabi-kobo-shell-v4`.
- Added a version query to the shared `app.js` request for release-safe cache refresh.
- Added CI regression coverage for the toggle wiring, persistent preference key, night tokens, and service-worker cache version.
- Updated the Desktop and Mobile/Foldable manuals with Day / Night guidance.

### Modified files
- `app/templates/base.html`
- `app/templates/how_to_guide.html`
- `app/static/css/design-tokens.css`
- `app/static/css/app.css`
- `app/static/css/language-ide.css`
- `app/static/js/app.js`
- `app/static/service-worker.js`
- `tests/test_app.py`

### New files
- `RELEASE_NOTES_GLOBAL_DAY_NIGHT_MODE_2026-08-08.md`
