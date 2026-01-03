# e2e Specification

## Purpose

TBD - created by archiving change setup-playwright-e2e. Update Purpose after archive.

## Requirements

### Requirement: Playwright Framework Integration

The project MUST include Playwright for automated E2E testing.

#### Scenario: Running E2E tests

- **Given** the extension is built in the `dist/v3` directory.
- **When** I run the E2E test command.
- **Then** Playwright should launch Chrome with the extension loaded and execute the tests.

### Requirement: JSON Reporting

Playwright MUST generate test reports in JSON format.

#### Scenario: Verifying report output

- **When** E2E tests are completed.
- **Then** a file named `playwright-report/results.json` should exist and contain the test results in JSON format.

### Requirement: Unified Test Command

The project MUST provide a single command to run all tests (unit and E2E) without watch mode by default.

#### Scenario: Running all tests

- **Given** the extension is built.
- **When** I run `npm test`.
- **Then** Jest unit tests should run first (non-watch).
- **And** Playwright E2E tests should run next (non-watch).

### Requirement: Git Exclusion

Playwright-related artifacts and reports MUST be excluded from version control.

#### Scenario: Checking gitignore

- **When** checking `.gitignore`.
- **Then** it should contain entries for `playwright-report/`, `test-results/`, and other Playwright-specific folders.
