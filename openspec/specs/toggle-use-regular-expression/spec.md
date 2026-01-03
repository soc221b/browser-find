# toggle-use-regular-expression Specification

## Purpose

TBD - created by archiving change add-core-e2e-tests. Update Purpose after archive.

## Requirements

### Requirement: toggle use regular expression

The extension MUST support regular expression searching and provide accessible feedback for the toggle state.

#### Scenario: Enabling regular expression

- **Given** the find bar is open.
- **When** I enable "Use Regular Expression".
- **Then** the "Use Regular Expression" button MUST have `aria-pressed="true"`.
- **And** I search for `[0-9]`.
- **Then** it should match any digit.

#### Scenario: Disabling regular expression

- **Given** the "Use Regular Expression" is enabled.
- **When** I disable "Use Regular Expression".
- **Then** the "Use Regular Expression" button MUST have `aria-pressed="false"`.
- **And** I search for `[0-9]`.
- **Then** it should match the literal string "[0-9]".
