# Spec: Minimap

## ADDED Requirements

### Requirement: Minimap Functionality

The application MUST display a minimap overlay that visualizes the position of search matches without interfering with the native scrollbar.

#### Scenario: Displaying Matches

- **Given** the user has performed a search
- **And** there are matches on the page
- **Then** an overlay on the right edge of the screen displays tick marks corresponding to the match positions
- **And** the native scrollbar remains visible and functional
- **And** the overlay allows mouse events to pass through to the native scrollbar (pointer-events: none)

#### Scenario: Visual Style (Square Ticks)

- **Given** matches are displayed on the minimap
- **Then** the tick marks appear as small "squares" (approx 6x6px)
- **And** the color is orange (`#FF9632`)
- **And** they have a subtle 1px border (`rgba(0,0,0,0.1)`) to ensure contrast against any background
- **And** they are horizontally centered within the overlay

### Requirement: Responsiveness

The minimap MUST accurately reflect match positions relative to the current viewport and document height.

#### Scenario: Window Resize

- **Given** the minimap is displaying matches
- **When** the browser window is resized
- **Then** the match ticks update their vertical positions to remain proportional to the new viewport/document ratio

#### Scenario: Content Change

- **Given** the minimap is displaying matches
- **When** the page content expands or shrinks (changing document height)
- **Then** the match ticks update their vertical positions

### Requirement: Layout Stability

The minimap implementation MUST NOT cause any layout shifts or visual disruption to the page content.

#### Scenario: Zero Layout Shift

- **Given** the Find extension is opened or closed
- **Then** the page content width does not change
- **And** the native scrollbar is never hidden or modified by the extension
