# Proposal: Setup Playwright for E2E Testing

## Problem

The project currently relies on Jest for unit and component testing, but lacks a robust framework for end-to-end (E2E) testing. Given that this is a browser extension, it is crucial to verify that the extension functions correctly within the actual browser environment (Chrome), especially its interaction with web pages.

## Proposed Solution

Introduce Playwright as the E2E testing framework. Playwright provides excellent support for testing Chrome extensions and allows for reliable cross-browser (if needed in the future, though only Chrome is currently targeted) testing.

### Key Features

- **Playwright Integration:** Install and configure Playwright.

- **JSON Reporting:** Configure Playwright to output test results in JSON format for easier integration with other tools or CI.

- **Git Integration:** Ensure Playwright-generated reports and artifacts are ignored by Git.

- **Chrome Extension Support:** Specific configuration to load the built extension into the browser during tests.

- **Test Separation:** Separate `test:unit` (Jest) and `test:e2e` (Playwright) scripts.
- **Unified Test Command:** `npm run test` runs both unit and E2E tests sequentially.
- **Non-watch Defaults:** All test scripts default to non-watch mode for CI compatibility.

## Scope

- Playwright installation and basic configuration.
- Configuration for JSON reporting.
- `.gitignore` updates.
- Basic E2E test example to verify the setup.
