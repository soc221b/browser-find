## ADDED Requirements

### Requirement: Scroll Behavior

The system SHALL only scroll the active match into view if it is not already visible using `scrollIntoViewIfNeeded(true)` after a search is performed.

#### Scenario: Match already visible after search

- **GIVEN** a search term is entered
- **AND** the first match is already visible in the viewport
- **WHEN** the search completes
- **THEN** the first match is highlighted as active
- **AND** the page scroll position DOES NOT change

#### Scenario: Match not visible after search

- **GIVEN** a search term is entered
- **AND** the first match is currently outside the viewport
- **WHEN** the search completes
- **THEN** the first match is highlighted as active
- **AND** the page scrolls to center the match in the viewport
