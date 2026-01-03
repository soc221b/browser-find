# show Specification

## ADDED Requirements

### Requirement: show find bar

The find bar MUST be visible when the show action is triggered.

#### Scenario: Opening via hotkey

- **Given** a web page is loaded.
- **When** I press `Meta+F` (on Mac) or `Control+F` (on Windows/Linux).
- **Then** the find bar UI should be visible.
