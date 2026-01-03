# Design: Playwright E2E Testing Setup

## Architecture

Playwright will be used to launch a Chrome instance with the `browser-find` extension pre-loaded. Tests will interact with web pages to trigger the extension's UI and verify its behavior.

### Component Diagram

1.  **Playwright Test Runner:** Orchestrates the tests.
2.  **Chrome Browser:** The target environment, launched with the extension.
3.  **Extension Artifacts:** The `dist/v3` folder containing the built extension.
4.  **Test Reports:** Generated in `playwright-report/` and as a JSON file.

## Technical Decisions

### 1. Extension Loading

Playwright will use the `persistentContext` approach to load the extension. This is the standard way to test Chrome extensions with Playwright.
The path to the extension will be derived from the build output directory (`dist/v3`).

### 2. Reporting

We will configure `playwright.config.ts` to use multiple reporters:

- `list` (for console output)
- `json` (for machine-readable output, saved to `playwright-report/results.json`)
- `html` (optional, but useful for debugging)

### 3. File Structure

- `playwright.config.ts`: Main configuration file.
- `e2e/`: Directory for E2E tests.
- `e2e/fixtures.ts`: Playwright fixtures to automate extension loading and state setup.

## Trade-offs

- **Overhead:** E2E tests are slower than unit tests. We will keep them focused on critical paths.
- **Complexity:** Testing extensions requires specific setup (e.g., handling background pages, service workers, and content scripts). Playwright's fixtures will help manage this complexity.
