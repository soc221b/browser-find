## MODIFIED Requirements

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
