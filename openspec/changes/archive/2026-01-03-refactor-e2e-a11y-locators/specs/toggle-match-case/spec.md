# toggle-match-case Specification Delta

## MODIFIED Requirements

### Requirement: toggle match case

The extension MUST support case-sensitive searching and provide accessible feedback for the toggle state.

#### Scenario: Enabling match case

- **Given** the find bar is open.
- **When** I enable "Match Case".
- **Then** the "Match Case" button MUST have `aria-pressed="true"`.
- **And** I search for "Apple".
- **Then** it should not match "apple".

#### Scenario: Disabling match case

- **Given** the "Match Case" is enabled.
- **When** I disable "Match Case".
- **Then** the "Match Case" button MUST have `aria-pressed="false"`.
- **And** I search for "Apple".
- **Then** it should match "apple".
