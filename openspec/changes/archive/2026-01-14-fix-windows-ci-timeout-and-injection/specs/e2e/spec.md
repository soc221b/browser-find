## ADDED Requirements

### Requirement: Robust Extension Injection

The extension MUST robustly inject its container into the page regardless of the page's lifecycle state at the time of injection. It MUST handle cases where the content script runs after the `DOMContentLoaded` event has already fired.

#### Scenario: Injecting after DOMContentLoaded

- **Given** a web page that has already finished loading (`document.readyState` is "complete").
- **When** the extension content script is executed.
- **Then** it MUST immediately initialize and append the `#browser-find-top-layer` to the `document.body`.

## MODIFIED Requirements

### Requirement: Playwright Framework Integration

The project MUST include Playwright for automated E2E testing. Tests MUST be independent, black-boxed, and use dedicated, co-located HTML fixture files for each spec to ensure test isolation and avoid side effects from shared global fixtures. **These fixtures MUST follow a standard minimal HTML5 template (including `lang="en"`, `meta charset`, and `viewport`) to ensure a consistent and modern testing environment.** **Locators MUST follow a prioritized strategy focused on accessibility and user-centricity, similar to `testing-library`.** **Tests SHOULD use platform-agnostic modifier keys like `ControlOrMeta` for keyboard interactions to ensure cross-platform compatibility.** **Fixture loading MUST ensure the extension is ready and the container is attached before proceeding with test steps.**

#### Scenario: Running E2E tests with dedicated co-located fixtures

- **Given** the extension is built.
- **And** a dedicated HTML fixture file is co-located with the spec file (e.g., `spec-name.fixture.html`).
- **And** the fixture follows the standard minimal HTML5 template.
- **When** I run the E2E tests using `loadFixture(filename)`.
- **Then** Playwright should successfully wait for the extension service worker to be ready.
- **AND** Playwright should load the specific fixture file.
- **And** the extension should be successfully injected into the page.

#### Scenario: Using prioritized locators in E2E tests

- **Given** the extension is active on a page.
- **When** I need to interact with an element.
- **Then** I SHOULD prefer `getByRole` over other locators.
- **And** I SHOULD prefer `getByLabel`, `getByPlaceholder`, or `getByText` if `getByRole` is not applicable.
- **And** I SHOULD only use CSS selectors or `getByTestId` as a last resort when semantic locators are unavailable.

#### Scenario: Using platform-agnostic modifier keys

- **Given** a test needs to simulate a keyboard shortcut (e.g., "Cmd+F" on Mac, "Ctrl+F" on Windows).
- **When** I use `page.keyboard.press('ControlOrMeta+f')`.
- **Then** Playwright should automatically map it to the correct modifier for the current platform.
