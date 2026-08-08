# Tsundoku Selection / Top-Edge Synchronization Fix — 2026-08-08

## Summary
Fixed the remaining Tsundoku reader desynchronization when returning to sentence 1.

## Root cause
Two behaviors could still conflict at the top edge:

1. Sentence selection used smooth scrolling, so the two independent pane animations could be interrupted or reinterpreted by synchronized-scroll events.
2. Top/bottom edge synchronization held the same global scroll lock used for programmatic alignment. If the learner immediately scrolled the opposite pane, legitimate user scroll events could be ignored briefly, leaving one pane on sentence 1 while the other remained around sentence 4.

## Changes
- Sentence selection is now authoritative and deterministic: both panes are placed directly at the selected sentence rather than running two smooth-scroll animations.
- Selecting sentence 1 explicitly pins both reading panes to `scrollTop = 0`.
- Selecting the final sentence explicitly pins both panes to their bottom edge.
- A one-frame alignment re-check handles ruby/font layout changes without introducing animation races.
- Top/bottom manual synchronization no longer applies the global scroll lock, so immediately switching which pane the user scrolls does not get suppressed.
- Middle-of-reading sentence-anchor synchronization remains unchanged.

## Modified files
- `app/static/js/tsundoku.js`
- `RELEASE_NOTES_TSUNDOKU_SELECTION_SYNC_FINAL_FIX_2026-08-08.md`
