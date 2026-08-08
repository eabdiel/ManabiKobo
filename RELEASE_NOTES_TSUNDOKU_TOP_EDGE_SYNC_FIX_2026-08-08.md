# Release Notes — Tsundoku Top-Edge Synchronization Fix
Date: 2026-08-08

## Summary
Fixes the remaining Tsundoku synchronized-scroll jump that occurred when a learner scrolled back to the top of either reading pane and selected sentence 1.

## Root Cause
The normal synchronization algorithm uses a viewport anchor roughly 32% down from the top of the pane. At `scrollTop = 0`, that anchor naturally lands near sentence 3 or 4. After a smooth programmatic scroll to sentence 1 completed and the temporary sync lock expired, the final scroll event could therefore interpret a lower sentence as the synchronization anchor and pull the opposite pane back toward the middle.

## Change
Synchronization is now edge-aware:
- When either pane is at/near the top, the counterpart is explicitly pinned to `scrollTop = 0`.
- When either pane is at/near the bottom, the counterpart is explicitly pinned to its bottom edge.
- Normal sentence-anchor synchronization remains unchanged for the middle of the reading.

## Modified Files
- `app/static/js/tsundoku.js`
- `RELEASE_NOTES_TSUNDOKU_TOP_EDGE_SYNC_FIX_2026-08-08.md`

## Expected Result
Scrolling upward and selecting sentence 1 should keep sentence 1 visible and both panes aligned instead of bouncing back toward sentences 3–4.
