## MODIFIED Requirements

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
