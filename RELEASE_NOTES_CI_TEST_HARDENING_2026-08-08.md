# Manabi Kōbō — CI/Test Hardening
## 2026-08-08

### Purpose
Fix the GitHub Actions blocker introduced by the tutorial static-asset regression test and make future CI failures easier to diagnose.

### Root cause corrected
`test_tutorial_static_assets_are_served(client)` used a pytest `client` fixture, but the repository did not define one. GitHub Actions therefore failed during test setup even though the application compiled and the other tests passed.

### Changes
- Added shared `app` and `client` pytest fixtures in `tests/conftest.py`.
- Kept the tutorial static-asset regression test so missing deployment assets are still caught before release.
- Changed CI to `python -m pytest -q` and `python -m pip` for interpreter-consistent execution.
- Added a release-critical-file preflight check for Tsundoku and tutorial assets.
- Set the Python test matrix to `fail-fast: false` so Python 3.11, 3.12, and 3.13 all report results instead of later jobs being cancelled after the first failure.
- Updated GitHub Actions runtime dependencies to Node-24-compatible `actions/checkout@v5` and `actions/setup-python@v6`, removing the Node 20 deprecation warnings seen in current GitHub-hosted runners.
- Compile-check now includes `tests` in addition to `app` and `main.py`.

### Files modified
- `.github/workflows/ci.yml`
- `tests/conftest.py`

### Files added
- `RELEASE_NOTES_CI_TEST_HARDENING_2026-08-08.md`

### Expected CI behavior
A healthy push to `main` should now:
1. Check out the complete repository.
2. Install dependencies for each supported Python version.
3. Verify critical structured-content/tutorial files exist.
4. Compile application and test Python sources.
5. Run the full pytest suite.
6. Report all three Python matrix outcomes even if one fails.
