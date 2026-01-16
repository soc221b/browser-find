## MODIFIED Requirements

### Requirement: Windows CI Support

The CI environment MUST support running E2E tests on Windows to ensure cross-platform compatibility. **Tests MUST be configured with sufficient timeouts (at least 60 seconds) to account for the slower performance of headful browsers on Windows CI runners.**

#### Scenario: Running E2E tests on Windows

- **Given** the CI environment is GitHub Actions (windows-latest).
- **And** the extension has been built.
- **When** the E2E test job executes `npm run test:e2e`.
- **Then** Playwright should successfully launch Chromium in headful mode.
- **AND** the tests should have a timeout of at least 60 seconds.
- **And** all E2E tests should pass.
