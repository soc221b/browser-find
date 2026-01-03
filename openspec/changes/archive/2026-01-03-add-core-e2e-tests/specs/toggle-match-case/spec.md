# toggle-match-case Specification

## ADDED Requirements

### Requirement: toggle match case

The extension MUST support case-sensitive searching.

#### Scenario: Enabling match case

- **Given** the find bar is open.
- **When** I enable "Match Case".
- **And** I search for "Apple".
- **Then** it should not match "apple".
