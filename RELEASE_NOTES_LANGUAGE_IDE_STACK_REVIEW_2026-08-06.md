# Manabi Kōbō — Full Stack Review and Correction Baseline

## Review summary

The GitHub Actions failure was caused by a tracked `app/__init__.py` importing `app.routes.ide_api`, while the IDE API module and related backend prototype files were untracked in the repository. A clean GitHub checkout therefore could not import the application.

The review also found that the checked-in `language-ide.css` had been reduced to a one-rule patch. The styled local page was relying on browser cache and would not render correctly on a clean client or Cloud Run deployment.

## Corrections

- Removed the obsolete IDE API blueprint import and registration from `app/__init__.py`.
- Removed unused prototype API/parser/compiler/project-manager files to eliminate two competing IDE implementations.
- Kept the current deterministic browser-local MK-LPL compiler as the Phase 1 runtime.
- Restored a complete, page-scoped Language IDE stylesheet.
- Preserved the shared site-wide workbench engine for drag, resize, minimize, layout save, and layout reset.
- Moved default Project Explorer/editor/compiler sizes into CSS so Reset Layout returns to the intended default dimensions.
- Made Project Explorer a normal draggable/resizable/minimizable workbench tile.
- Fixed first-load state so initialization does not write a blank editor over a sample.
- Fixed sample reset so it restores canonical files without re-saving the outgoing corrupted buffer.
- Added validation and isolation for per-project browser storage.
- Kept Hello World first/default, Restaurant second, and Daily Standup third.
- Added complete populated sample files for all three projects.
- Retained working New Scratch Project, Import, Export, Save, Compile, Debug, Refactor, and keyboard shortcuts.
- Added IDE CSS/JS to the service-worker shell and bumped the cache version.
- Added CI coverage for the Language IDE route and static assets.
- Removed `.git`, `.idea`, caches, stale patch notes, and obsolete incremental prototype artifacts from the distributable ZIP.

## Modified files

- `app/__init__.py`
- `app/templates/ide/workspace.html`
- `app/static/js/language-ide.js`
- `app/static/css/language-ide.css`
- `app/static/service-worker.js`
- `tests/test_app.py`

## Removed obsolete files

- `app/routes/ide.py`
- `app/routes/ide_api.py`
- `app/data/ide_projects.py`
- `app/services/mkpl_engine.py`
- `app/services/mkpl_compiler.py`
- `app/services/mkpl_parser.py`
- `app/services/project_manager.py`
- `tests/test_mkpl_engine.py`
- old IDE patch/template fragments and obsolete incremental release-note scaffolds

## Infrastructure

No deployment configuration, Cloud Run scripts, Dockerfile, workflow definition, dependency files, or security files were modified.
