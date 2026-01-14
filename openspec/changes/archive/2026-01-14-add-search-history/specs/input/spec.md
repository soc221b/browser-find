## ADDED Requirements

### Requirement: Search History

The system MUST maintain a history of search states, allowing the user to undo and redo changes to the search query and options.

#### Scenario: Undo grouped text input (Granularity)

- **GIVEN** the search input is empty
- **WHEN** I type "hello" quickly
- **AND** I wait for the OS-like timeout
- **AND** I trigger the Undo command
- **THEN** the search input becomes empty (instead of "hell")

#### Scenario: Redo action

- **GIVEN** I have undone a text change from "foo" to "fo"
- **WHEN** I trigger the Redo command
- **THEN** the search input returns to "foo"

#### Scenario: Persistence across close/open

- **GIVEN** the search input contains "find me"
- **AND** the history contains previous entries
- **WHEN** I close the find bar
- **AND** I reopen the find bar
- **AND** I trigger the Undo command
- **THEN** the search input reverts to the previous state in history

#### Scenario: History Limit

- **GIVEN** the history contains 100 entries
- **WHEN** a new search state is created
- **THEN** the oldest history entry is removed
- **AND** the new state is added, maintaining the size at 100

#### Scenario: New change clears redo

- **GIVEN** I have undone changes and have a redo stack
- **WHEN** I type a new character
- **THEN** the redo stack is cleared
- **AND** the new state is appended to the history

#### Scenario: Keyboard Shortcuts (macOS)

- **GIVEN** the user is on macOS
- **AND** the input is focused
- **WHEN** the user presses `Cmd+Z`
- **THEN** the Undo action is triggered
- **WHEN** the user presses `Cmd+Shift+Z`
- **THEN** the Redo action is triggered

#### Scenario: Keyboard Shortcuts (Windows/Linux)

- **GIVEN** the user is on Windows or Linux
- **AND** the input is focused
- **WHEN** the user presses `Ctrl+Z`
- **THEN** the Undo action is triggered
- **WHEN** the user presses `Ctrl+Y` or `Ctrl+Shift+Z`
- **THEN** the Redo action is triggered
