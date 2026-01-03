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
