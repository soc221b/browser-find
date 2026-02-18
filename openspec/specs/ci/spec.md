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

### Requirement: npm Dependency Caching

The CI environment MUST cache npm dependencies to speed up the installation phase of all jobs.

#### Scenario: Restoring npm cache

- **Given** a previous CI run has successfully executed `npm ci`.
- **When** a new job starts and executes `actions/setup-node` with caching enabled.
- **Then** the `node_modules` or global npm cache should be restored.
- **And** `npm ci` should complete significantly faster than a fresh install.

### Requirement: Playwright Browser Caching

The CI environment MUST cache Playwright browsers to reduce installation time in subsequent runs.

#### Scenario: Using cached Playwright browsers

- **Given** a previous run has already downloaded the browsers.
- **When** the E2E job starts.
- **Then** it should restore browsers from the cache.
- **And** it should install system dependencies using `--with-deps` if there is a cache miss, or via `install-deps` if there is a cache hit.
