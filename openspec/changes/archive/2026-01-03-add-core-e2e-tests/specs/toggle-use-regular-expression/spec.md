# toggle-use-regular-expression Specification

## ADDED Requirements

### Requirement: toggle use regular expression

The extension MUST support regular expression searching.

#### Scenario: Enabling regular expression mode

- **Given** the find bar is open.
- **When** I enable "Use Regular Expression".
- **And** I search for "\d+".
- **Then** it should match numeric digits.
