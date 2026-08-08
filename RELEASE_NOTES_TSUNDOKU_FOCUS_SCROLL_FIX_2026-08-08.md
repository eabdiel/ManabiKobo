# Manabi Kōbō — Tsundoku Focus / Scroll Fix
## 2026-08-08

### Fix
Corrected a reader focus issue where clicking a sentence could cause the synchronized panes to jump to a different sentence while the selected row was being smoothly aligned.

### Root cause
`focusSentence()` smoothly scrolled both panes at the same time. Those programmatic scroll events were also being processed by the normal sentence-anchor synchronization listener. During the animation, one pane could temporarily identify a neighboring sentence as the closest viewport anchor and move the opposite pane again, producing the visible "bounce".

### Implementation
- Added a reusable synchronization lock with timer cancellation.
- Programmatic sentence focus now keeps synchronization locked throughout the smooth scroll animation.
- Existing pending unlock timers can no longer release the lock in the middle of a newer programmatic focus operation.
- Selected sentences are positioned slightly nearer the top of the pane so the clicked line and surrounding context remain visible.
- Normal manual synchronized scrolling remains enabled after the focus animation completes.

### Modified files
- `app/static/js/tsundoku.js`
- `RELEASE_NOTES_TSUNDOKU_FOCUS_SCROLL_FIX_2026-08-08.md`
