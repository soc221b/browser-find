# find-previous Specification

## Purpose

TBD - created by archiving change add-core-e2e-tests. Update Purpose after archive.

## Requirements

### Requirement: navigate to previous match

The system SHALL highlight the previous match in the sequence.

#### Scenario: Cycle backwards through matches

- **WHEN** multiple matches exist
- **AND** the user triggers "Find Previous"
- **THEN** the focus moves to the previous match in the list
- **AND** wraps around to the last match if at the beginning

#### Scenario: Target match missing (Recovery)

- **WHEN** the element containing the previous match has been removed from the DOM
- **AND** the user triggers "Find Previous"
- **THEN** the system performs a new search based on current text
- **AND** updates the list of found matches to reflect the current DOM
- **AND** focuses the match that appears _at or before_ the last known valid position

#### Scenario: All matches missing (Recovery to empty)

- **WHEN** all matching elements have been removed from the DOM
- **AND** the user triggers "Find Previous"
- **THEN** the system performs a new search
- **AND** updates the match count to 0/0
- **AND** removes all highlights

#### Scenario: Matches replaced by new content

- **WHEN** all previously found matching elements are removed
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Previous"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the new match closest to (at or before) the last known anchor position

#### Scenario: No matches exist (Dynamic discovery)

- **WHEN** 0 matches were previously found
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Previous"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the last match

#### Scenario: Only one match exists (Dynamic discovery)

- **WHEN** only 1 match was previously found
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Previous"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the previous match in sequence (wrapping if necessary)

#### Scenario: Wrap around (Dynamic discovery)

- **WHEN** multiple matches exist
- **AND** the focus is on the first match
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Previous"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the last match in the updated list

### Requirement: Visual Highlighting

The system MUST visually distinguish the active match from other matches.

#### Scenario: Highlighting on previous

- **Given** multiple matches exist.
- **When** I click the "Previous" button.
- **Then** the new active match MUST be highlighted in orange.
- **And** all other matches MUST be highlighted in yellow.
- **And** there MUST be exactly one active match.

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
