# Language IDE v2.0 — Functional Compiler Update
## Added
- Server-side deterministic MK-LPL compile API
- Real Run/Compile, diagnostics, line-jump debugger and deterministic refactor
- Restaurant, Hello World and Daily Standup projects
- Multi-file tabs; create/delete editable .mkpl/.mkvoc scripts
- Browser-local project save/load and reset
- JSON project export
- Ctrl+S, Ctrl+Enter and F8 shortcuts
- Runtime execution of say() statements into bounded Japanese output
- Unit tests
- Approved default IDE proportions while retaining shared user rearrangement/resizing
## Files
app/__init__.py; app/data/ide_projects.py; app/routes/ide_api.py; app/services/mkpl_engine.py; app/templates/ide/workspace.html; app/static/css/language-ide.css; app/static/js/language-ide.js; tests/test_mkpl_engine.py.
No infrastructure/deployment files modified.
