## MODIFIED Requirements

### Requirement: Playwright Framework Integration

The project MUST include Playwright for automated E2E testing. Tests MUST be independent, black-boxed, and use dedicated, co-located HTML fixture files for each spec to ensure test isolation and avoid side effects from shared global fixtures. **These fixtures MUST follow a standard minimal HTML5 template (including `lang="en"`, `meta charset`, and `viewport`) to ensure a consistent and modern testing environment.** **Locators MUST follow a prioritized strategy focused on accessibility and user-centricity, similar to `testing-library`.** **Tests SHOULD use platform-agnostic modifier keys like `ControlOrMeta` for keyboard interactions to ensure cross-platform compatibility.**

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

#### Scenario: Using platform-agnostic modifier keys

- **Given** a test needs to simulate a keyboard shortcut (e.g., "Cmd+F" on Mac, "Ctrl+F" on Windows).
- **When** I use `page.keyboard.press('ControlOrMeta+f')`.
- **Then** Playwright should automatically map it to the correct modifier for the current platform.

## ADDED Requirements

### Requirement: Test Stability and Robustness

E2E tests MUST avoid using hardcoded delays (e.g., `page.waitForTimeout()`). Instead, tests MUST use web-first assertions, `expect.poll()`, or `expect().toPass()` to wait for specific states or conditions. This ensures tests are resilient to timing variations and execute as fast as possible.

#### Scenario: Waiting for a state change without hardcoded timeouts

- **Given** an action is performed that triggers an asynchronous UI update.
- **When** I want to verify the update.
- **Then** I MUST use an assertion like `await expect(locator).toBeVisible()` or `await expect(locator).toHaveText(...)`.
- **And** I MUST NOT use `await page.waitForTimeout(...)`.

#### Scenario: Asserting on values that change over time

- **Given** I need to verify a value that might not be stable immediately (e.g., a bounding box after a resize).
- **When** I use `expect.poll(() => locator.boundingBox()).toEqual(expectedValue)`.
- **Then** Playwright should retry the check until it passes or times out.

### Requirement: High-Discrimination Test Scenarios

E2E tests MUST use non-trivial scenarios to verify functionality. This includes using regular expressions for complex matching and designing fixtures where different match types (e.g., current match vs. other matches) result in highly distinguishable counts or states.

#### Scenario: Verifying complex matches with regex

- **Given** the "Use Regular Expression" toggle is enabled.
- **When** I enter a regex pattern (e.g., `[tT]arget`).
- **Then** the extension MUST correctly highlight all matching text according to regex rules.

#### Scenario: Verifying distinguishable highlight counts

- **Given** a fixture with multiple matches.
- **When** I search for a pattern.
- **Then** the `thisCount` (current match characters) and `theOthersCount` (other matches characters) MUST be verified to ensure they are distinct and accurate.

#### Scenario: Verifying navigation with non-uniform matches

- **Given** a fixture with matches of different lengths (e.g., "apple", "pineapple").
- **When** I navigate to the next or previous match.
- **Then** the `thisCount` MUST update to reflect the length of the currently active match.
- **And** the `theOthersCount` MUST update to reflect the sum of all other matches.
