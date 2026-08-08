# Manabi Kōbō — How-to Night Mode Contrast Fix

Date: 2026-08-08

## Summary
Corrects low-contrast blocks on the How to Use landing page and desktop/mobile manuals when global Night mode is enabled.

## Root cause
The tutorial stylesheet predated the global Day/Night token layer and still referenced legacy variable names such as `--surface-2` and `--text-muted`. Those variables were undefined in the new theme, causing the stylesheet to fall back to light-colored surfaces while inheriting light night-mode text.

## Changes
- Switched tutorial components to the canonical shared tokens: `--surface`, `--surface2`, `--ink`, `--muted`, `--line`, and `--primary`.
- Added explicit Night-mode rules for guide cards, manual cards, table-of-contents chips, tool blocks, workflow blocks, screenshots, and secondary text.
- Bumped How-to stylesheet asset version to `1.0.2`.
- Bumped the service-worker shell cache to `manabi-kobo-shell-v5`.
- Added CI regression tests that reject the legacy tutorial token names and verify the new CSS version is rendered by all How-to routes.

## Modified files
- `app/static/css/how-to-use.css`
- `app/templates/how_to_use.html`
- `app/templates/how_to_guide.html`
- `app/static/service-worker.js`
- `tests/test_app.py`
- `RELEASE_NOTES_HOW_TO_NIGHT_MODE_CONTRAST_FIX_2026-08-08.md`
