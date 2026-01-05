## MODIFIED Requirements

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
- **And** new matches are NOT added to the minimap even if the new content matches the search query

### Requirement: End-to-End Test Coverage for Minimap

The system SHALL provide comprehensive end-to-end test coverage for the minimap functionality.

#### Scenario: Basic Minimap Functionality on Non-Scrollable Page

- **WHEN** a non-scrollable page is loaded
- **THEN** the minimap is displayed correctly and reflects the visible content.

#### Scenario: Minimap Stability with Scrolling on Scrollable Page

- **WHEN** a scrollable page is loaded and the user scrolls
- **THEN** the minimap matches remain in their fixed positions relative to the viewport
- **AND** no viewport indicator is displayed or moved.

#### Scenario: Minimap Ignores New Matches in Dynamic Content

- **WHEN** content on a page dynamically loads or changes and contains the search term
- **THEN** the minimap updates the vertical positions of existing matches
- **AND** the minimap does NOT display ticks for the matches in the new content.

#### Scenario: Minimap Responds to Window Resizing

- **WHEN** the browser window is resized
- **THEN** the minimap adjusts its layout and scale appropriately.

#### Scenario: Minimap updates when dynamic content loads between matches

- **WHEN** matches are present and dynamic content is loaded in between them
- **THEN** the vertical positions of existing matches are updated to match their new relative positions in the document.
