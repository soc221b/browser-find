## MODIFIED Requirements

### Requirement: navigate to previous match

The system SHALL highlight the previous match in the sequence.

#### Scenario: Cycle backwards through matches

- **WHEN** multiple matches exist
- **AND** the user triggers "Find Previous"
- **THEN** the focus moves to the previous match in the list
- **AND** wraps around to the last match if at the beginning

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
