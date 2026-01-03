# e2e Specification Delta

## MODIFIED Requirements

### Requirement: Playwright Framework Integration

The project MUST include Playwright for automated E2E testing. Tests MUST be independent, black-boxed, and use dedicated, co-located HTML fixture files for each spec to ensure test isolation and avoid side effects from shared global fixtures. **Locators MUST follow a prioritized strategy focused on accessibility and user-centricity, similar to `testing-library`.**

#### Scenario: Running E2E tests with dedicated co-located fixtures

- **Given** the extension is built.
- **And** a dedicated HTML fixture file is co-located with the spec file (e.g., `spec-name.fixture.html`).
- **When** I run the E2E tests using `loadFixture(filename)`.
- **Then** Playwright should load the specific fixture file.
- **And** the extension should be successfully injected into the page.

#### Scenario: Using prioritized locators in E2E tests

- **Given** the extension is active on a page.
- **When** I need to interact with an element.
- **Then** I SHOULD prefer `getByRole` over other locators.
- **And** I SHOULD prefer `getByLabel`, `getByPlaceholder`, or `getByText` if `getByRole` is not applicable.
- **And** I SHOULD only use CSS selectors or `getByTestId` as a last resort when semantic locators are unavailable.

## ADDED Requirements

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

#### Scenario: Selecting the search input

- **Given** the search box is open.
- **When** I want to type into the search input.
- **Then** I SHOULD use `page.getByPlaceholder('Search')` or `page.getByRole('textbox', { name: 'Search' })` instead of a CSS selector.

#### Scenario: Clicking the close button

- **Given** the search box is open.
- **When** I want to close it.
- **Then** I SHOULD use `page.getByRole('button', { name: 'Close' })` instead of `.close`.
