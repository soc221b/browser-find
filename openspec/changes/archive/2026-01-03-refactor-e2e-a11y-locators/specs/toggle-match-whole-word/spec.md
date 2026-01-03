# toggle-match-whole-word Specification Delta

## MODIFIED Requirements

### Requirement: toggle match whole word

The extension MUST support whole word searching and provide accessible feedback for the toggle state.

#### Scenario: Enabling match whole word

- **Given** the find bar is open.
- **When** I enable "Match Whole Word".
- **Then** the "Match Whole Word" button MUST have `aria-pressed="true"`.
- **And** I search for "word".
- **Then** it should not match "words".

#### Scenario: Disabling match whole word

- **Given** the "Match Whole Word" is enabled.
- **When** I disable "Match Whole Word".
- **Then** the "Match Whole Word" button MUST have `aria-pressed="false"`.
- **And** I search for "word".
- **Then** it should match "words".
