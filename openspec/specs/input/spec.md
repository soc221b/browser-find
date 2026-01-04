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
