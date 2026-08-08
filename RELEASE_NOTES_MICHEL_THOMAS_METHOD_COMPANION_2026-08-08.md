# Manabi Kōbō — Michel Thomas Method Companion wording and guidance

Date: 2026-08-08

## Summary
- Renamed the shared navigation/catalog item from **Audio Course Companion** to **Michel Thomas Method Companion**.
- Added an explicit top-of-page introduction explaining that the page is Edwin's independent, post-course study workflow for material learned with Michel Thomas Japanese audio.
- Clarified that the page contains no Michel Thomas audio, does not replace the course, and is not an official or endorsed Michel Thomas product.
- The recommended sequence now clearly says to complete the audio material first, following the method without written aids, and only afterward use Manabi Kōbō for reading, kana writing, track/reference review, recall cards, and long-term reinforcement.
- Updated the How-to manual entry to match the post-course workflow.
- Added English and Spanish regression coverage for the new naming/guidance.

## Files modified
- `app/data/pages.py`
- `app/data/native_tools.py`
- `app/templates/native_tool.html`
- `app/templates/how_to_guide.html`
- `app/templates/base.html`
- `app/static/css/app.css`
- `tests/test_app.py`

## Files added
- `RELEASE_NOTES_MICHEL_THOMAS_METHOD_COMPANION_2026-08-08.md`

## Deployment note
`app.css` is versioned as `v1.0.20` in the shared base template so the new introduction styling is fetched after deployment.
