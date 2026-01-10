# shadow-dom Specification

## Purpose

TBD - created by archiving change shadow-dom. Update Purpose after archive.

## Requirements

### Requirement: Search in Shadow DOM

The system SHALL support finding and highlighting text content located within open Shadow Roots.

#### Scenario: Text in open shadow root

- **GIVEN** a page with an element that has an open shadow root
- **AND** the shadow root contains a text node with "inside shadow"
- **WHEN** the user searches for "inside shadow"
- **THEN** the system MUST find the match
- **AND** correctly highlight it using browser Ranges

#### Scenario: Nested Shadow DOM

- **GIVEN** an element with an open shadow root
- **AND** that shadow root contains another element with its own open shadow root
- **AND** the inner shadow root contains the text "deeply nested"
- **WHEN** the user searches for "deeply nested"
- **THEN** the system MUST find and highlight the match
