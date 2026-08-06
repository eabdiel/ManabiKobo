# Think in Japanese V2.26 — Hosted Companion & Cloud Run Standardization

**Release date:** August 5, 2026  
**Author:** Edwin A. Rodriguez / ProgreTech

## Summary

This release establishes the August 5 Cloud Run deployment as the new application baseline, restores the hosted AI companion across the shared Flask shell, masks decorative text embedded in the home-page hero artwork, and removes obsolete scaffold files from the distributable project.

## Home-page hero correction

- Added a theme-aware glass title card behind the live **Think in Japanese** heading.
- The card visually masks lettering embedded in the scenic source image instead of allowing two title treatments to overlap.
- Added dedicated Pixel Pastel, Garden Cream, and Tokyo Night contrast treatments.
- Preserved the scenic artwork, independent mascot cutout, responsive actions, and existing mobile behavior.

## AI companion

- Restored the Aminos AI companion used by the legacy HTML site.
- Loaded the companion once from `app/templates/base.html`, so it appears consistently across English and Spanish Flask routes.
- Preserved the legacy bot identifier `59258` as the default.
- Added environment-variable configuration:
  - `TIJ_AI_COMPANION_ENABLED=true|false`
  - `TIJ_AI_COMPANION_BOT_ID=<bot id>`
- Included current page and language metadata on the loader element for future companion enhancements.
- Offline HTML downloads intentionally remain independent and continue using their original standalone implementation.

## Cloud Run and repository standardization

- Kept `main.py` as the only Python application entry point.
- Added `Procfile` with the Cloud Run-compatible Gunicorn command.
- Added `.gcloudignore` and `.dockerignore` to reduce uploaded build context and prevent local IDE, cache, archive, and virtual-environment files from entering builds.
- Removed obsolete root-level `app.py`, `run.py`, duplicate `templates/`, and duplicate `static/` scaffold content.
- Removed local `.git`, `.idea`, and Python cache material from the release archive.

## Runtime command

```text
gunicorn --bind 0.0.0.0:$PORT main:app
```

## Added files

- `.gcloudignore`
- `.dockerignore`
- `Procfile`

## Modified files

- `app/__init__.py`
- `app/config.py`
- `app/templates/base.html`
- `app/static/css/app.css`
- `RELEASE.md`

## Removed files and directories

- `app.py`
- `run.py`
- `templates/`
- `static/`
- `.git/`
- `.idea/`
- Python `__pycache__/` directories

## Deployment note

The AI companion depends on its hosted JavaScript provider and therefore requires internet access. The rest of the Flask application and the downloadable standalone HTML companions retain their existing offline-friendly behavior.


## V2.26.1 — Kana Dojo Canvas Hotfix

- Replaced the non-functional decorative resize corners with explicit horizontal resize handles.
- Removed the automatic `ResizeObserver` persistence that could save unintended widths and heights.
- Kana Dojo tile layouts now persist only order and user-selected width.
- Removed forced 720px tile heights so controls, board rows, review history, and bottom content remain visible.
- Allowed the Kana workspace and parent container to grow vertically without clipping.
- Added a new layout storage version so previously corrupted Kana layouts are ignored.
- Applied to English and Spanish Kana Dojo pages and all three themes.

### Modified files

- `app/static/css/app.css`
- `app/static/js/kana-dojo.js`
- `RELEASE.md`


## v1.0.1 Review Corrections

- Removed the top-right Offline download button from the shared application shell.
- Removed the Modes Available / offline HTML sections from all native learning pages.
- Removed remaining offline-download actions and changed iframe workspace wording to “Interactive learning workspace.”
- Added a defensive professional report token so previously bookmarked download URLs no longer raise `KeyError: professional`.
- Increased the home hero height and preserved the banner composition across desktop, tablet, and mobile breakpoints.

### Files modified

- `app/templates/base.html`
- `app/templates/study_tool.html`
- `app/templates/native_tool.html`
- `app/templates/study_plan.html`
- `app/templates/phrases.html`
- `app/templates/tool.html`
- `app/services/report_service.py`
- `app/static/css/app.css`
- Compatibility mirrors under `templates/` and `static/css/`

## v1.0.2 — GitHub Repository Readiness

- Removed obsolete duplicate root entry points and compatibility mirror directories so the repository has one authoritative Flask application structure.
- Removed Python bytecode and cache artifacts.
- Replaced the legacy Think in Japanese README with Manabi Kōbō setup, architecture, testing, and deployment guidance.
- Expanded `.gitignore` and added `.env.example`.
- Added development dependencies and Flask smoke tests.
- Added GitHub Actions CI for Python 3.11, 3.12, and 3.13.
- Added contribution, security, and repository license documentation.
- Standardized active configuration variable names to the `MK_` namespace.

### Added files and directories

- `.github/workflows/ci.yml`
- `.env.example`
- `requirements-dev.txt`
- `tests/test_app.py`
- `tests/conftest.py`
- `CONTRIBUTING.md`
- `SECURITY.md`
- `LICENSE`

### Modified files

- `.gitignore`
- `README.md`
- `RELEASE.md`
- `main.py`
- `app/__init__.py`
- `app/config.py`

### Removed files and directories

- `app.py`
- `run.py`
- `static/`
- `templates/`
- Python `__pycache__/` directories and compiled bytecode

## v1.0.3 — Shared Two-Dimensional Tile Layout Fix

### Changes
- Added one shared two-dimensional resize implementation for every Manabi Kōbō workbench tile.
- Tile width and height are now persisted per page and language in browser local storage.
- Added a consistent bottom-right resize handle to Kana Dojo, Study Plan, 90-Day Tracker, phrase decks, and native tools.
- Centered the Kana Dojo tile canvas in the available workspace.
- Removed the Kana Dojo rule that forced tiles back to automatic height.
- Filled the previously empty Daily 20-Minute Routine study-plan tile.
- Renamed Phrases 1 to Essential Phrases and Phrases 2 to Natural Conversation, including Spanish labels.
- Updated affected browser page titles from Think in Japanese to Manabi Kōbō.
- Removed remaining offline-download wording from the two phrase-deck instruction lists.

### Modified files
- `app/static/css/workbench.css`
- `app/static/css/app.css`
- `app/static/js/workbench-core.js`
- `app/data/phrases.py`
- `app/data/study_plan_content.json`
- `app/templates/kana_dojo.html`
- `app/templates/study_plan.html`
- `app/templates/phrases.html`
- `app/templates/tracker.html`
- `RELEASE.md`
