## MODIFIED Requirements

### Requirement: Persistent Context Data Location

Playwright persistent context data MUST be stored within the `node_modules` directory to avoid cluttering the project root and ensure it is excluded from version control. **The path MUST be correctly resolved for the host operating system to ensure stability across platforms (macOS, Linux, Windows).**

#### Scenario: Verifying user data directory location

- **Given** the E2E tests are running.
- **When** the browser context is created.
- **Then** the `userDataDir` MUST be located under `node_modules/.playwright/`.
- **AND** the path MUST be valid for the current OS.

## ADDED Requirements

### Requirement: Cross-Platform Fixture Loading

The test suite MUST reliably load local HTML fixtures across all supported operating systems.

#### Scenario: Loading a fixture on Windows

- **GIVEN** the test suite is running on Windows.
- **WHEN** `loadFixture` is called.
- **THEN** it MUST use `pathToFileURL` to generate a valid `file:///` URL.
- **AND** the browser MUST successfully navigate to the fixture.
