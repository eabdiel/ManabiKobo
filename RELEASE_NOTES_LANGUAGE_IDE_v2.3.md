# Language IDE v2.3 — combined v2.2 + v2.3 fixes

Built from the GitHub v2.1/early-v2 baseline and the tested issues reported afterward.

## Functional fixes
- Project switching now saves the outgoing project/file buffer before loading the target project.
- Each sample has canonical, populated working files.
- `main.mkpl` is explicitly the compile entry point, independent of tab/file order.
- Sample project edits are isolated per project.
- Reset removes the local override and restores the canonical sample.
- New Scratch Project now creates and activates a real project with a working `main.mkpl`.
- New-project control is rendered/bound with Project Explorer, so explorer redraws cannot destroy its handler.
- Import accepts exported Manabi project JSON and creates a collision-safe local project.
- Export includes all project files.
- Compile validates project declaration, compile directive, end marker, and executes supported `.say()` statements.
- Debug jumps to the first diagnostic.
- Refactor includes bounded safe prototype corrections.
- Ctrl+S, Ctrl+Enter, and F8 are wired.

## UX / help
- Hover help on command buttons, Project Explorer, editor, compiler/debugger, runtime, vocabulary/modules, tutorials, and build notes.
- How-To / Future Tutorials area retained and expanded.

## Integration
Replace these files in the existing Manabi Kōbō repository:
- `app/templates/ide/workspace.html`
- `app/static/js/language-ide.js`
- `app/static/css/language-ide.css`

No deployment/infrastructure files are modified.

## v2.3.1 visual restoration
- Restored the complete Language IDE visual shell after the v2.3 additive stylesheet accidentally replaced the prior full IDE stylesheet.
- Restored themed hero/banner, command bar, themed buttons, project explorer card, editor/compiler/runtime/vocabulary/tutorial tiles, tabs, diagnostics, status bar, responsive layout, and resize behavior.
- Uses the shared Manabi Kōbō design tokens so the IDE remains visually consistent with the rest of the site.
- Functional v2.2/v2.3 JavaScript fixes are retained unchanged.
