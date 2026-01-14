# ci Specification

## Purpose

TBD - created by archiving change configure-headful-ci. Update Purpose after archive.

## Requirements

### Requirement: Headful CI Execution

The CI environment MUST support running E2E tests in headful mode using a virtual display.

#### Scenario: Running E2E tests in GitHub Actions

- **Given** the CI environment is GitHub Actions (ubuntu-latest).
- **And** the extension has been built.
- **When** the E2E test job executes `xvfb-run npm run test:e2e`.
- **Then** Playwright should successfully launch Chromium in headful mode.
- **And** all E2E tests should pass or report failures correctly without "no display" errors.

### Requirement: CI Build Dependency

The CI environment MUST build the extension before running E2E tests.

#### Scenario: Preparing for E2E tests

- **Given** a new commit is pushed.
- **When** the E2E job starts.
- **Then** it must run `npm run build` to generate the `dist/v3` directory.
- **And** it must install Playwright browsers and system dependencies.

### Requirement: Windows CI Support

The CI environment MUST support running E2E tests on Windows to ensure cross-platform compatibility. **Tests MUST be configured with sufficient timeouts (at least 60 seconds) to account for the slower performance of headful browsers on Windows CI runners.**

#### Scenario: Running E2E tests on Windows

- **Given** the CI environment is GitHub Actions (windows-latest).
- **And** the extension has been built.
- **When** the E2E test job executes `npm run test:e2e`.
- **Then** Playwright should successfully launch Chromium in headful mode.
- **AND** the tests should have a timeout of at least 60 seconds.
- **And** all E2E tests should pass.
