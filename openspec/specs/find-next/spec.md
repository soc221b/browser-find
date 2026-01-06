# find-next Specification

## Purpose

TBD - created by archiving change add-core-e2e-tests. Update Purpose after archive.

## Requirements

### Requirement: navigate to next match

The extension MUST allow navigating to the next match.

#### Scenario: Clicking next button

- **Given** multiple matches exist.
- **When** I click the "Next" button.
- **Then** the active match index should increment.

### Requirement: Visual Highlighting

The system MUST visually distinguish the active match from other matches.

#### Scenario: Highlighting on next

- **Given** multiple matches exist.
- **When** I click the "Next" button.
- **Then** the new active match MUST be highlighted in orange.
- **And** all other matches MUST be highlighted in yellow.
- **And** there MUST be exactly one active match.
