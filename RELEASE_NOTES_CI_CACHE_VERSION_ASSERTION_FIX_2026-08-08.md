# Release Notes — CI Cache-Version Assertion Fix — 2026-08-08

## Summary
Removes a brittle GitHub Actions blocker caused by tests hard-coding an exact service-worker cache revision.

## Changes
- Updated `tests/test_app.py` so the service-worker regression test validates the `manabi-kobo-shell-vN` naming contract instead of requiring a specific revision such as `v4`.
- The test now confirms that the cache name is present, numeric, and versioned, while allowing intentional cache bumps (`v5`, `v6`, etc.) without requiring unrelated test maintenance.
- No application runtime behavior, styling, routes, or deployment configuration were changed.

## Files Modified
- `tests/test_app.py`

## Files Added
- `RELEASE_NOTES_CI_CACHE_VERSION_ASSERTION_FIX_2026-08-08.md`

## Validation Goal
Future service-worker cache invalidation releases should not fail CI solely because the expected cache number was hard-coded in a test.
