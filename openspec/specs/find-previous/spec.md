# find-previous Specification

## Purpose

TBD - created by archiving change add-core-e2e-tests. Update Purpose after archive.

## Requirements

### Requirement: navigate to previous match

The extension MUST allow navigating to the previous match.

#### Scenario: Clicking previous button

- **Given** multiple matches exist.
- **When** I click the "Previous" button.
- **Then** the active match index should decrement.

### Requirement: Visual Highlighting

The system MUST visually distinguish the active match from other matches.

#### Scenario: Highlighting on previous

- **Given** multiple matches exist.
- **When** I click the "Previous" button.
- **Then** the new active match MUST be highlighted in orange.
- **And** all other matches MUST be highlighted in yellow.
- **And** there MUST be exactly one active match.
