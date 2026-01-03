# Proposal: Add Core E2E Tests

This proposal aims to establish a robust end-to-end testing suite for the core functionality of the Browser Find extension. The tests will be designed to be independent, black-boxed, and will utilize custom HTML fixtures to ensure stability and speed by avoiding external network dependencies.

## Problem Statement

Currently, the project lacks comprehensive e2e tests. The existing `basic.spec.ts` relies on `https://example.com`, which is an external dependency. We need a way to verify that the extension works correctly across various search scenarios (plain text, regex, case sensitivity, etc.) in a controlled environment.

## Proposed Solution

- Implement a suite of e2e tests using Playwright.
- Use local HTML files as test fixtures to simulate various DOM structures and content.
- Focus on testing the following core functionalities:
  - Activation and deactivation of the find bar.
  - Basic text search and match navigation.
  - Regex search functionality.
  - Match case and whole word filters.
  - Accurate result counting and visual highlighting.

## Benefits

- **Stability:** Tests are not affected by changes to external websites.
- **Speed:** Local fixtures load instantly.
- **Coverage:** Ensures that all core features work as expected before release.
- **Maintainability:** Clear, independent tests make it easier to identify regressions.
