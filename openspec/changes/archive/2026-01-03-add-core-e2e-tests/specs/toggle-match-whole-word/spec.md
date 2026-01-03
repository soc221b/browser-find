# toggle-match-whole-word Specification

## ADDED Requirements

### Requirement: toggle match whole word

The extension MUST support whole word searching.

#### Scenario: Enabling match whole word

- **Given** the find bar is open.
- **When** I enable "Match Whole Word".
- **And** I search for "test".
- **Then** it should not match "testing".
