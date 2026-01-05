## ADDED Requirements

### Requirement: Persistent Context Data Location

Playwright persistent context data MUST be stored within the `node_modules` directory to avoid cluttering the project root and ensure it is excluded from version control.

#### Scenario: Verifying user data directory location

- **Given** the E2E tests are running.
- **When** the browser context is created.
- **Then** the `userDataDir` MUST be located under `node_modules/.playwright/`.

## MODIFIED Requirements

### Requirement: Git Exclusion

Playwright-related artifacts, reports, and temporary user data MUST be excluded from version control.

#### Scenario: Checking gitignore

- **When** checking `.gitignore`.
- **Then** it should contain entries for `playwright-report/`, `test-results/`, and other Playwright-specific folders or be stored in ignored directories like `node_modules/`.
