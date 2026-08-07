# Language IDE v2.1.1 — Functional Corrections Only

Built directly against the reverted v2.1 GitHub layout.

## Corrections
- New Scratch Project button now works and keeps the existing workbench design.
- Button uses the same cream/theme treatment as the top command buttons.
- Restaurant, Hello World, and Daily Standup each receive their own populated working `main.mkpl`.
- Project switching saves the outgoing project buffer before loading the next project.
- Each sample uses a project-specific localStorage key, preventing file rollover between projects.
- `main.mkpl` remains the compile entry point regardless of tab order.
- Import opens a real hidden file picker and imports exported project JSON.
- Export includes every project file.
- Reset clears the sample's local override and restores its canonical populated files.
- Scratch reset restores a clean working `main.mkpl`.
- Compile, debugger, refactor, save, keyboard shortcuts and runtime output remain functional.

## Design safety
- Existing v2.1 HTML structure and full IDE stylesheet remain authoritative.
- Only a tiny additive CSS rule was added for the New Scratch Project button.
- No workbench tile dimensions, global tokens, shared CSS, or infrastructure files were changed.

## Files
- app/templates/ide/workspace.html
- app/static/js/language-ide.js
- app/static/css/language-ide.css
- RELEASE_NOTES_LANGUAGE_IDE_v2.1.1.md
