# Manabi Kōbō v1.0.11 — Pre-Deployment Polish

## Changes

- Moved the Home dashboard **Save Layout** and **Reset Layout** controls into the shared top header, immediately before the language selector.
- Removed the duplicate layout-action row from the Home page content.
- Added a responsive compact presentation for the header controls on narrower desktop displays.
- Updated the Home footer to end with **Another tool by ProgreTech.com**, linked to `https://progretech.com`.
- Added matching Spanish footer wording.

## Modified files

- `app/templates/base.html`
- `app/templates/home.html`
- `app/static/css/app.css`
- `RELEASE.md`

---

# Manabi Kōbō v1.0.6 — Kanji Hub & Professional Deck Readability

## Summary
- Added the shared 3×2 informational-tile default and overflow scrolling to Kanji Hub.
- Applied the same easier-to-read 3×2 default to Tech & Office Talk.
- Redesigned Kanji Hub cards with separate on’yomi and kun’yomi panels, meaning-first memory anchors, kana/furigana support, translation, and expandable source references.
- Added curated on’yomi/kun’yomi data for the initial core kanji set and meaning-defining memory anchors for the first twelve high-frequency cards.
- Advanced layout persistence to `mk:v5` so the improved defaults are visible during testing.

## Modified files
- `app/data/tool_content.json`
- `app/static/css/app.css`
- `app/static/js/native_tools.js`
- `app/static/js/workbench-core.js`
- `app/templates/native_tool.html`
- `RELEASE.md`

---

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

## v1.0.4 — Layout Persistence and Content Cleanup

### Changes
- Removed the redundant Study Plan page and navigation entry; the 90-Day Tracker is now the canonical 90-day study experience.
- Removed the remaining Gaki no Tsukai/Gaki Style pages, route mappings, navigation links, study-plan phase, and legacy sitemap references.
- Replaced the placeholder Gaki-derived Tech & Office Talk deck with an original professional starter deck for meetings, support, testing, deployment, code review, requirements, and workplace communication.
- Added a visible **Save Layout** button to every draggable workbench, including the home dashboard.
- Layout saves now persist tile order, width, height, and minimized state in browser local storage.
- Added a home-dashboard reset control and a shared save/reset confirmation message.
- Incremented the shared layout-storage schema to `mk:v3` to avoid conflicts with older partial layouts.

### Modified files and directories
- `app/data/pages.py`
- `app/data/phrases.py`
- `app/data/phrase_content.json`
- `app/data/study_tools.py`
- `app/routes/core.py`
- `app/static/js/workbench-core.js`
- `app/static/js/workspace.js`
- `app/static/css/workbench.css`
- `app/templates/home.html`
- `app/templates/kana_dojo.html`
- `app/templates/native_tool.html`
- `app/templates/phrases.html`
- `app/templates/study_tool.html`
- `app/templates/tracker.html`
- `app/static/legacy/` navigation and sitemap cleanup
- `README.md`
- `RELEASE.md`

### Removed files
- `app/templates/study_plan.html`
- `app/data/study_plan_content.json`
- `app/static/legacy/think_in_japanese_part6_90_day_plan.html`
- `app/static/legacy/think_in_japanese_part6_90_day_plan_es.html`
- `app/static/legacy/think_in_japanese_100_gaki_style_phrases_part3.html`
- `app/static/legacy/think_in_japanese_100_gaki_style_phrases_part3_es.html`


## v1.0.5 — Scrollable Resized Tiles and Informational Defaults

### Changes
- Resized tile bodies now receive their own vertical and horizontal scrollbars whenever content exceeds the available tile canvas.
- Tile toolbars remain visible while the body scrolls, so drag, minimize, and resize controls remain reachable.
- Added a shared informational-tile classification rather than page-specific overflow patches.
- Content-heavy calendar, phrase-deck, reading/frequency, course-reference, and games-table tiles now open at a desktop default sized to show approximately six cards in a 3-column by 2-row viewport.
- Kept interactive control and notes tiles at their existing sizes. Kana Dojo, Kanji Radicals, and Sentence Builder retain their specialized default layouts.
- The 90-Day Tracker calendar uses the informational default and remains fully scrollable after the user makes it smaller.
- Mobile layouts continue to use natural page height instead of nested tile scrolling.
- Incremented layout storage to `mk:v4` so previously saved undersized layouts do not hide the corrected defaults.

### Modified files
- `app/static/css/workbench.css`
- `app/static/js/workbench-core.js`
- `README.md`
- `RELEASE.md`

## v1.0.7 — Compact Kanji Radicals Workspace

### Changes
- Reduced the Kanji Radicals default workspace height so the page opens as a focused tool instead of a long preloaded canvas.
- Set a balanced desktop default with compact controls, a scrollable radicals workspace, and a slim guidance tile.
- Changed the radicals grid to four compact cards across on wide desktop screens, three across on medium screens, two across on tablets, and one across on mobile.
- Applied the Manabi Kōbō visual treatment used by the Kanji Hub: torii-red accents, warm neutral surfaces, compact result badges, and restrained shadows.
- Preserved shared drag, resize, minimize, Save Layout, Reset Layout, and overflow scrolling behavior.
- Incremented layout storage to `mk:v6` so previously saved oversized radical layouts do not override the new defaults.

### Modified files
- `app/static/css/app.css`
- `app/static/js/workbench-core.js`
- `RELEASE.md`

## v1.0.8 — Sentence Builder Default Layout

### Summary
- Updated the Sentence Builder to open in a structured two-row desktop layout matching the reviewed arrangement.
- First row now defaults to Color Key, Structured Syllabus, Core Sentence Patterns, and Pattern Flashcards.
- Second row now defaults to Mini Grammar Cheat Sheet, Controls, Sentence Builder, and Guidance & Notes.
- Added practical default widths and heights while preserving scrollbars for content that exceeds a tile's canvas.
- Kept all shared drag, horizontal/vertical resize, minimize, Save Layout, and Reset Layout behavior intact.
- Added responsive two-column and single-column fallbacks for smaller screens.
- Advanced the shared layout storage key to `mk:v7` so the new default is visible during testing.

### Files modified
- `app/static/css/app.css`
- `app/static/js/workbench-core.js`
- `RELEASE.md`


## v1.0.9 — Audio Course Companion Compact Layout

### Summary
- Updated the Audio Course Companion / Michel Thomas page to open in a compact two-row desktop arrangement based on the reviewed layout.
- The first row now defaults to compact Controls, a wide phrase-reinforcement workspace, and Guidance & Notes.
- The second row now defaults to the CD-by-CD Syllabus, 6/12 Week Calendar, and Suggested Weekly Routine.
- Progress, detailed track reference, kana writing, and recall-card tiles continue below in restrained scrollable canvases instead of opening at full content height.
- All tile bodies retain overflow scrolling, while dragging, two-dimensional resizing, minimizing, Save Layout, and Reset Layout remain available.
- Added responsive two-column and single-column fallbacks for smaller screens.
- Advanced the shared layout storage key to `mk:v8` and the audio-page native layout key to `v2` so previously saved expanded dimensions do not override the new reviewed default.

### Files modified
- `app/static/css/app.css`
- `app/static/js/native_tools.js`
- `app/static/js/workbench-core.js`
- `RELEASE.md`

## v1.0.10 — Favicon and Installable Web App

### Added
- Production favicon and app-icon set under `app/static/icons/`.
- Web app manifest with standalone display, start URL, theme colors, standard icons, and a maskable Android icon.
- Root-scoped service worker registration so supported browsers recognize Manabi Kōbō as installable.
- Context-aware **Install app** control in the shared top navigation.
- iPhone/iPad and Android home-screen installation guidance dialog in English and Spanish.
- Apple mobile-web-app, Android mobile-web-app, Microsoft tile, theme-color, and application-name metadata.

### Modified files and directories
- `app/routes/core.py`
- `app/templates/base.html`
- `app/static/css/app.css`
- `app/static/js/install-app.js`
- `app/static/service-worker.js`
- `app/static/icons/`
- `RELEASE.md`
