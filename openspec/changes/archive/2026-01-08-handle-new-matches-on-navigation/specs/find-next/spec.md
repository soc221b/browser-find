## MODIFIED Requirements

### Requirement: navigate to next match

The system SHALL highlight the next match in the sequence.

#### Scenario: Cycle through matches

- **WHEN** multiple matches exist
- **AND** the user triggers "Find Next"
- **THEN** the focus moves to the next match in the list
- **AND** wraps around to the first match if at the end

#### Scenario: No matches exist (Dynamic discovery)

- **WHEN** 0 matches were previously found
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Next"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the first match

#### Scenario: Only one match exists (Dynamic discovery)

- **WHEN** only 1 match was previously found
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Next"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the next match in sequence (wrapping if necessary)

#### Scenario: Wrap around (Dynamic discovery)

- **WHEN** multiple matches exist
- **AND** the focus is on the last match
- **AND** new elements containing the search term are added to the DOM
- **AND** the user triggers "Find Next"
- **THEN** the system performs a new search
- **AND** finds the new matches
- **AND** focuses the first match in the updated list
