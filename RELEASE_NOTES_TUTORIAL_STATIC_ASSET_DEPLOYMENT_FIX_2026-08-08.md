# Manabi Kōbō — Tutorial Static Asset Deployment Fix

**Date:** 2026-08-08  
**Scope:** How-to guides / Google Cloud Run static delivery

## Problem

The deployed How-to page received the new HTML and stylesheet, but tutorial screenshots returned the application 404 page. The local Flask application rendered correctly. The service worker also used a cache-first strategy for all `/static/` resources, allowing older CSS/JS revisions to remain visible after a deployment.

## Changes

- Bumped the service-worker shell cache from `manabi-kobo-shell-v2` to `manabi-kobo-shell-v3`.
- Changed CSS, JavaScript, and tutorial screenshot requests to **network-first with cached offline fallback**.
- Kept cache-first behavior for stable icons and other shell resources.
- Bumped How-to CSS and tutorial screenshot URLs to `v=1.0.1`.
- Added explicit `.gcloudignore` inclusion rules for the How-to stylesheet and tutorial screenshot directory.
- Added Docker build assertions so Cloud Build fails rather than deploying if required tutorial assets are missing from the source/build context.
- Added Flask tests that verify representative tutorial static assets return HTTP 200.

## Files modified

- `.gcloudignore`
- `Dockerfile`
- `app/static/service-worker.js`
- `app/templates/how_to_use.html`
- `app/templates/how_to_guide.html`
- `tests/test_app.py`

## Files added

- `RELEASE_NOTES_TUTORIAL_STATIC_ASSET_DEPLOYMENT_FIX_2026-08-08.md`

## Deployment verification

After deploying the new revision, verify these URLs directly before testing the guide UI:

- `/static/css/how-to-use.css?v=1.0.1`
- `/static/assets/tutorial/desktop-home.png?v=1.0.1`
- `/static/assets/tutorial/mobile-home.jpg?v=1.0.1`
- `/en/how-to-use/`
- `/en/how-to-use/desktop/`
- `/en/how-to-use/mobile/`

The two image URLs must return the actual image rather than the Manabi Kōbō 404 page.
