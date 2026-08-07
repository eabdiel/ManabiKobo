# Manabi Kōbō Phase 1 Language IDE v1.1

This package contains complete replacement/new source files for the current GitHub `main` baseline (commit 948ae4e).

## Integration
Copy the included `app/` directory over the current repository root, preserving all other repository files.

The Language IDE is registered in the canonical page registry, so it appears:
- in the desktop top menu (inside the first 8 pages)
- under Professional Resources in the sidebar
- in Home Quick Access and Complete Tool Catalog
- at `/en/language-ide/` and `/es/language-ide/`

## Functional Phase 1 behavior
- Native Manabi Kōbō shared shell
- Shared draggable/resizable/minimizable workbench
- IDE banner and local learner profile
- Project tracker
- Editable MK-LPL source
- Run/compile simulation
- Debug/refactor feedback
- Local browser save/load
- Runtime output
- Vocabulary library
- Project test simulation

## Files modified/added
- app/data/pages.py
- app/routes/core.py
- app/templates/ide/workspace.html (new)
- app/static/css/language-ide.css (new)
- app/static/js/language-ide.js (new)

No infrastructure/deployment files were modified.
