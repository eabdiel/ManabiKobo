# Manabi Kōbō — Tsundoku & Navigation Refinements
## 2026-08-08

### Changes
- Replaced the low-contrast Tsundoku grammar palette with a more distinguishable semantic color set while keeping the surrounding reader in the Manabi Kōbō theme.
- Increased grammar legend swatch size/contrast.
- Fixed the bookshelf progress element so it remains constrained to the 4px progress track and no longer renders as a large red block over the “More collections coming soon” card.
- Merged **Essential Phrases** and **Natural Conversation** into **Memory and Internal Monologue Phrases**. The merged runtime deck contains all 200 existing approved phrases; source JSON remains unchanged. Existing memorized marks from both former decks are migrated into the merged deck on first open.
- Old `/phrases-1/` and `/phrases-2/` URLs redirect to the merged page.
- Moved the merged phrase workspace into **Practice & Tools**.
- Added **How to Use the Site** immediately after Home in navigation. For now it intentionally contains only **In the works!** / **¡En desarrollo!**.
- Updated the Home Complete Tool Catalog and Quick Access area to expose the merged phrase page rather than duplicate phrase apps.
- Updated mobile navigation to use stable page slugs and include Home, How to Use, Kana Dojo, and Tsundoku.

### Modified files and directories
- `app/data/pages.py`
- `app/data/phrases.py`
- `app/routes/core.py`
- `app/templates/base.html`
- `app/templates/home.html`
- `app/templates/tsundoku.html`
- `app/templates/phrases.html`
- `app/static/css/app.css`
- `app/static/css/tsundoku.css`
- `app/static/js/phrases.js`

### New files
- `app/templates/how_to_use.html`
- `RELEASE_NOTES_TSUNDOKU_AND_NAV_REFINEMENTS_2026-08-08.md`

### Intentionally unchanged
- `app/data/phrase_content.json` — the original two 100-item phrase datasets remain intact and are combined only by the content service at runtime.
- Existing Tsundoku story JSON and progress/preference namespaces.
