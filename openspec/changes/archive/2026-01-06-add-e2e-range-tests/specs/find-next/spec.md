## ADDED Requirements

### Requirement: Visual Highlighting

The system MUST visually distinguish the active match from other matches.

#### Scenario: Highlighting on next

- **Given** multiple matches exist.
- **When** I click the "Next" button.
- **Then** the new active match MUST be highlighted in orange.
- **And** all other matches MUST be highlighted in yellow.
- **And** there MUST be exactly one active match.
