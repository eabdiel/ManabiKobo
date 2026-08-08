# Memory & Internal Monologue Route Fix — 2026-08-08

## Issue
Opening `/en/memory-monologue/` or `/es/memory-monologue/` returned HTTP 500.

## Root Cause
The merged phrase template referenced `deck.items` when rendering the visible-item count. Because `deck` is a Python dictionary, Jinja resolved `items` as the dictionary `items()` method instead of the `"items"` data key, causing the `|length` filter to fail during template rendering.

## Fix
Changed the template reference to explicit key syntax: `deck["items"]|length`.

## Modified Files
- `app/templates/phrases.html`

## New Files
- `RELEASE_NOTES_MEMORY_MONOLOGUE_ROUTE_FIX_2026-08-08.md`
