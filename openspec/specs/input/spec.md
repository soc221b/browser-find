# input Specification

## Purpose

TBD - created by archiving change add-core-e2e-tests. Update Purpose after archive.

## Requirements

### Requirement: text input

The extension MUST perform a search when text is entered.

#### Scenario: Searching for text

- **Given** the find bar is open and focused.
- **When** I type "test".
- **Then** the extension should perform a find operation for "test".

### Requirement: No Find Input Placeholder

The find input field SHALL NOT display a placeholder.

#### Scenario: Placeholder removal

- **WHEN** the find input is displayed
- **THEN** no placeholder text is visible

### Requirement: Visual Highlighting

The system MUST visually distinguish the active match from other matches during input.

#### Scenario: Highlighting on search

- **When** I type a search term that has multiple matches.
- **Then** the first match MUST be highlighted in orange.
- **And** all other matches MUST be highlighted in yellow.
- **And** there MUST be exactly one active match.

### Requirement: Scroll Behavior

The system SHALL only scroll the active match into view if it is not already visible using `scrollIntoViewIfNeeded(true)` after a search is performed.

#### Scenario: Match already visible after search

- **GIVEN** a search term is entered
- **AND** the first match is already visible in the viewport
- **WHEN** the search completes
- **THEN** the first match is highlighted as active
- **AND** the page scroll position DOES NOT change

#### Scenario: Match not visible after search

- **GIVEN** a search term is entered
- **AND** the first match is currently outside the viewport
- **WHEN** the search completes
- **THEN** the first match is highlighted as active
- **AND** the page scrolls to center the match in the viewport
