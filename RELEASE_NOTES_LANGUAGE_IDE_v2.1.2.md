# Language IDE v2.1.2 — No Style Regression

This package intentionally does not contain `app/static/css/language-ide.css`.

The existing full v2.1 stylesheet in the repository remains authoritative.

## Functional corrections
- Working New Scratch Project
- Populated Restaurant, Hello World, and Daily Standup samples
- Isolated project/file state
- main.mkpl compile entry point independent of tab order
- Functional Import and Export
- Functional Reset to canonical samples
- Compile, Debug, Refactor, Save, and keyboard shortcuts retained

## Files changed
- app/templates/ide/workspace.html
- app/static/js/language-ide.js
- RELEASE_NOTES_LANGUAGE_IDE_v2.1.2.md

## Important
Do not delete or replace the existing `app/static/css/language-ide.css`.
No shared workbench, global style, or infrastructure file was modified.
