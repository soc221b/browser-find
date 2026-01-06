## ADDED Requirements

### Requirement: Visual Highlighting

The system MUST visually distinguish the active match from other matches during input.

#### Scenario: Highlighting on search

- **When** I type a search term that has multiple matches.
- **Then** the first match MUST be highlighted in orange.
- **And** all other matches MUST be highlighted in yellow.
- **And** there MUST be exactly one active match.
