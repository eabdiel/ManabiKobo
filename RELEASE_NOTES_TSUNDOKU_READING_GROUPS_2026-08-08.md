# Manabi Kōbō — Tsundoku Reading Groups & Sync Default
## 2026-08-08

### Summary
This refinement changes synchronized scrolling to an explicit opt-in and adds configurable multi-sentence comparison rows for longer readings.

### Changes
- **Sync now defaults to OFF.**
  - A one-time preference migration also switches existing POC browsers to OFF once so the new default is visible during testing.
  - After that migration, a user's Sync toggle choice continues to persist under the existing `mk.reader.syncScroll` preference.
- Added **# of Sentences per Reading** to the Tsundoku toolbar.
  - Numeric input.
  - Minimum: `1`.
  - Maximum: `10`.
  - Default: `1`.
  - Saved independently as `mk.reader.sentencesPerReading`.
- Reading rows are now generated as configurable groups.
  - `1` preserves the current sentence-by-sentence experience.
  - Higher values combine consecutive source sentences into the same Japanese/translation comparison row.
  - Example: a value of `4` produces rows `1–4`, `5–8`, `9–12`, etc.
- Japanese and English/Spanish panes use the exact same source-sentence groups.
- Grammar-token relation highlighting continues to work inside grouped readings.
- Selected Reading Insight now summarizes the entire active sentence group.
- Previous/Next navigation advances by the configured reading-group size.
- Progress display shows the active range (for example `5–8 / 16 sentences`).
- Merely changing the group size does **not** falsely advance saved reading completion; progress advances when a reading group is selected/navigated.
- Updated Reading Tools terminology from sentence-specific wording to reading-group wording where appropriate.

### Persistence / Content Safety
No reading JSON schema changes were required. Existing story files remain sentence-based, so authors can continue adding content at the sentence level while learners decide at runtime whether to compare 1–10 sentences together. This keeps source content independent from display preferences and allows the same book to support sentence, multi-sentence, or paragraph-like practice without republishing content.

### Files Modified
- `app/static/js/tsundoku.js`
- `app/static/css/tsundoku.css`
- `app/templates/tsundoku.html`

### Files Added
- `RELEASE_NOTES_TSUNDOKU_READING_GROUPS_2026-08-08.md`

### Validation
- `node --check app/static/js/tsundoku.js`
- Python compile check for `main.py`, `app/routes/core.py`, and `app/services/reading_content_service.py`
- Final ZIP integrity test
