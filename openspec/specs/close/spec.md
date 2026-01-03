# close Specification

## Purpose

TBD - created by archiving change add-core-e2e-tests. Update Purpose after archive.

## Requirements

### Requirement: close find bar

The find bar MUST be removed when the close action is triggered.

#### Scenario: Closing via Escape key

- **Given** the find bar is open.
- **When** I press the `Escape` key.
- **Then** the find bar UI should be removed.

#### Scenario: Closing via UI button

- **Given** the find bar is open.
- **When** I click the close button.
- **Then** the find bar UI should be removed.
