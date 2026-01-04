## MODIFIED Requirements

### Requirement: End-to-End Test Coverage for Minimap

The system SHALL provide comprehensive end-to-end test coverage for the minimap functionality.

#### Scenario: Basic Minimap Functionality on Non-Scrollable Page

- **WHEN** a non-scrollable page is loaded
- **THEN** the minimap is displayed correctly and reflects the visible content.

#### Scenario: Minimap Stability with Scrolling on Scrollable Page

- **WHEN** a scrollable page is loaded and the user scrolls
- **THEN** the minimap matches remain in their fixed positions relative to the viewport
- **AND** no viewport indicator is displayed or moved.

#### Scenario: Minimap Renders Dynamic Content

- **WHEN** content on a page dynamically loads or changes
- **THEN** the minimap updates to reflect the new content structure and visibility.

#### Scenario: Minimap Responds to Window Resizing

- **WHEN** the browser window is resized
- **THEN** the minimap adjusts its layout and scale appropriately.

#### Scenario: Minimap updates when dynamic content loads between matches

- **WHEN** matches are present and dynamic content is loaded in between them
- **THEN** the minimap accurately reflects the new content and the vertical positions of existing matches are updated to match their new relative positions in the document.
