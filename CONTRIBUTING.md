# Contributing

## Local setup

1. Create and activate a Python 3.11+ virtual environment.
2. Install development dependencies:
   ```bash
   pip install -r requirements-dev.txt
   ```
3. Run the application:
   ```bash
   python main.py
   ```
4. Open `http://127.0.0.1:5000/en/`.

## Shared UI rule

Do not create page-specific substitutes for tile behavior or design tokens. Changes to draggable, resizable, minimizable tiles must be implemented in the shared workbench files:

- `app/static/css/design-tokens.css`
- `app/static/css/workbench.css`
- `app/static/js/workbench-core.js`

Page-level CSS and JavaScript may extend the shared foundation, but must not duplicate or override its core interaction contract without an explicit architectural reason.

## Before opening a pull request

Run:

```bash
python -m compileall -q app main.py
pytest -q
```

Update `RELEASE.md` and include a list of modified files and directories.
