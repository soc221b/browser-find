# find-next Specification

## Purpose

TBD - created by archiving change add-core-e2e-tests. Update Purpose after archive.

## Requirements

### Requirement: navigate to next match

The system SHALL highlight the next match in the sequence.

#### Scenario: Cycle through matches

- **WHEN** multiple matches exist
- **AND** the user triggers "Find Next"
- **THEN** the focus moves to the next match in the list
- **AND** wraps around to the first match if at the end

#### Scenario: Target match missing (Recovery)

- **WHEN** the element containing the next match has been removed from the DOM
- **AND** the user triggers "Find Next"
- **THEN** the system performs a new search based on current text
- **AND** updates the list of found matches to reflect the current DOM
- **AND** focuses the first match that appears _after_ the last known valid position

#### Scenario: All matches missing (Recovery to empty)

- **WHEN** all matching elements have been removed from the DOM
- **AND** the user triggers "Find Next"
- **THEN** the system performs a new search
- **AND** updates the match count to 0/0
- **AND** removes all highlights

#### Scenario: Matches replaced by new content

- **WHEN** all previously found matching elements are removed
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Next"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the new match closest to the last known anchor position

### Requirement: Visual Highlighting

The system MUST visually distinguish the active match from other matches.

#### Scenario: Highlighting on next

- **Given** multiple matches exist.
- **When** I click the "Next" button.
- **Then** the new active match MUST be highlighted in orange.
- **And** all other matches MUST be highlighted in yellow.
- **And** there MUST be exactly one active match.
