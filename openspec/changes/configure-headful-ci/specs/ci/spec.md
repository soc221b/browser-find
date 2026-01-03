# ci Specification (Delta)

## Requirements

### ADDED Requirement: Headful CI Execution

The CI environment MUST support running E2E tests in headful mode using a virtual display.

#### Scenario: Running E2E tests in GitHub Actions

- **Given** the CI environment is GitHub Actions (ubuntu-latest).
- **And** the extension has been built.
- **When** the E2E test job executes `xvfb-run npm run test:e2e`.
- **Then** Playwright should successfully launch Chromium in headful mode.
- **And** all E2E tests should pass or report failures correctly without "no display" errors.

### ADDED Requirement: CI Build Dependency

The CI environment MUST build the extension before running E2E tests.

#### Scenario: Preparing for E2E tests

- **Given** a new commit is pushed.
- **When** the E2E job starts.
- **Then** it must run `npm run build` to generate the `dist/v3` directory.
- **And** it must install Playwright browsers and system dependencies.
