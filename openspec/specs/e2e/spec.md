# e2e Specification

## Purpose

TBD - created by archiving change setup-playwright-e2e. Update Purpose after archive.

## Requirements

### Requirement: Playwright Framework Integration

The project MUST include Playwright for automated E2E testing. Tests MUST be independent, black-boxed, and use dedicated, co-located HTML fixture files for each spec to ensure test isolation and avoid side effects from shared global fixtures. **These fixtures MUST follow a standard minimal HTML5 template (including `lang="en"`, `meta charset`, and `viewport`) to ensure a consistent and modern testing environment.** **Locators MUST follow a prioritized strategy focused on accessibility and user-centricity, similar to `testing-library`.**

#### Scenario: Running E2E tests with dedicated co-located fixtures

- **Given** the extension is built.
- **And** a dedicated HTML fixture file is co-located with the spec file (e.g., `spec-name.fixture.html`).
- **And** the fixture follows the standard minimal HTML5 template.
- **When** I run the E2E tests using `loadFixture(filename)`.
- **Then** Playwright should load the specific fixture file.
- **And** the extension should be successfully injected into the page.

#### Scenario: Using prioritized locators in E2E tests

- **Given** the extension is active on a page.
- **When** I need to interact with an element.
- **Then** I SHOULD prefer `getByRole` over other locators.
- **And** I SHOULD prefer `getByLabel`, `getByPlaceholder`, or `getByText` if `getByRole` is not applicable.
- **And** I SHOULD only use CSS selectors or `getByTestId` as a last resort when semantic locators are unavailable.

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

### Requirement: E2E Locator Priority

E2E tests MUST prioritize locators in the following order:

1. `page.getByRole()`
2. `page.getByLabel()`
3. `page.getByPlaceholder()`
4. `page.getByText()`
5. `page.getByDisplayValue()`
6. `page.getByAltText()`
7. `page.getByTitle()`
8. `page.getByTestId()`

**Tests MUST prefer accessibility-based locators and standard ARIA attributes over implementation-specific attributes (like `data-*`) for verifying state.**

#### Scenario: Testing toggle state

- **When** verifying the state of a toggle button.
- **Then** the test MUST use `aria-pressed` or `getByRole('button', { pressed: boolean })` instead of `data-*` attributes.
