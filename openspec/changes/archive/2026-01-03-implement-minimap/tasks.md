# Tasks

1.  [x] Create `Minimap` overlay component structure.
    - [x] Set up fixed positioning and `pointer-events: none`.
    - [x] Ensure proper Z-index to overlay content but sit under typical modal layers if possible.
2.  [x] Implement logic to calculate tick positions.
    - [x] Create utility to map `match.y` -> `viewport.y`.
    - [x] Handle `scrollTop` offsets if necessary (though usually fixed overlay implies mapping total document height to viewport height).
3.  [x] Implement "Square" styling.
    - [x] Create CSS for 6x6px orange box with 1px subtle border (`rgba(0,0,0,0.1)`).
4.  [x] Implement Responsiveness.
    - [x] Add `resize` event listener to update tick positions.
    - [x] Add `MutationObserver` or polling to detect document height changes.
5.  [x] Integrate with Search Store.
    - [x] Subscribe to `matches` state.
    - [x] Render a tick for each match.
6.  [x] Verify and Polish.
    - [x] Verify alignment with native scrollbar thumb.
    - [x] Verify "click-through" works (can scroll natively).
    - [x] Check performance with 100+ matches.
