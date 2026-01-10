## ADDED Requirements

### Requirement: Scroll Behavior

The system SHALL only scroll the active match into view if it is not already visible using `scrollIntoViewIfNeeded(true)`.

#### Scenario: Match already visible

- **GIVEN** multiple matches exist
- **AND** the previous match is already visible in the viewport
- **WHEN** the user triggers "Find Previous"
- **THEN** the focus moves to the previous match
- **AND** the page scroll position DOES NOT change

#### Scenario: Match not visible

- **GIVEN** multiple matches exist
- **AND** the previous match is currently outside the viewport
- **WHEN** the user triggers "Find Previous"
- **THEN** the focus moves to the previous match
- **AND** the page scrolls to center the match in the viewport
