## ADDED Requirements

### Requirement: Windows CI Support

The CI environment MUST support running E2E tests on Windows to ensure cross-platform compatibility.

#### Scenario: Running E2E tests on Windows

- **Given** the CI environment is GitHub Actions (windows-latest).
- **And** the extension has been built.
- **When** the E2E test job executes `npm run test:e2e`.
- **Then** Playwright should successfully launch Chromium in headful mode.
- **And** all E2E tests should pass.
