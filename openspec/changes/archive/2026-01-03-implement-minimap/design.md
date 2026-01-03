# Design: Minimap Overlay

## Architecture

### Component Structure

A `Minimap` component will be introduced as a transparent overlay.

1.  **Overlay Container:** A fixed-position container anchored to the right edge of the viewport.
    - `position: fixed; top: 0; right: 0; height: 100vh;`
    - `width`: Approx 12-16px (matches typical scrollbar width).
    - `pointer-events: none;` (Crucial for click-through).
    - `z-index`: High enough to float over page content (e.g., 9999), but low enough not to obscure global modals if strictly necessary (though usually Find-in-page sits on top).
2.  **Minimap Ticks:** Indicators rendered within this container.

### Interaction & Layout

- **Native Scrollbar:** We will NOT hide or replace the native scrollbar.
- **Click-through:** The overlay container must have `pointer-events: none`.
- **Positioning:** The overlay sticks to the right edge.

### Minimap Rendering

- **Data Source:** `matches` (search results) from the store.
- **Mapping Strategy:**
  - `pageHeight = document.documentElement.scrollHeight`
  - `viewportHeight = window.innerHeight`
  - `markerY = (matchY / pageHeight) * viewportHeight`
  - _Note:_ `matchY` refers to the absolute Y position of the match relative to the document top.
- **Updates:** The minimap must recalculate positions on:
  - Window resize.
  - Document content changes (height change).

## Visual Style

- **Minimap Ticks (Squares):**
  - **Shape:** Simple square marker.
  - **Dimensions:** Fixed size, e.g., `6px` x `6px`.
  - **Alignment:** Centered horizontally in the overlay.
  - **Style:**
    - **Color:** `#FF9632` (Orange).
    - **Effect:** Clean, flat square. A very subtle border MUST be added for contrast on varied backgrounds.
      - `border: 1px solid rgba(0,0,0,0.1);`
  - **Clustering:** If matches are too close (e.g., < 2px apart), they may overlap visually. This is acceptable and desired (creates a "dense" cluster look).

## Performance & Optimization

- **Rendering:**
  - **DOM vs Canvas:** For < 1000 matches, DOM nodes (divs) are sufficient and easier to style.
  - **Optimization:** If matches exceed a threshold (e.g., 2000), consider switching to a `<canvas>` renderer or simple debounced rendering to avoid freezing the UI.
  - **Batching:** Updates to match positions should be throttled (e.g., on scroll/resize) if they involve complex recalculations, though simple CSS positioning is cheap.
- **Responsiveness:**
  - Use `ResizeObserver` on `document.body` or `window` resize listeners to trigger re-renders of the ticks.

## Risks

- **Visibility:** On some OS/Browsers, scrollbars float or are invisible until scrolled. The ticks will remain permanently visible on the right edge, which is intended behavior.
- **Contrast:** Ticks must be visible against the page background if the scrollbar is transparent. The square's subtle border helps with contrast on white/colored backgrounds.
