# Proposal: Refine E2E Locator Priority

## Problem

Current E2E tests in `browser-find` rely heavily on CSS selectors (e.g., `#browser-find-top-layer .input`), which are brittle and don't reflect how users interact with the application. Adopting a locator priority similar to `testing-library` will make tests more robust, accessible, and user-centric.

## Proposed Solution

Update the E2E testing guidelines and existing tests to follow a prioritized locator strategy:

1.  **Queries Accessible to Everyone**: `getByRole`, `getByLabel`, `getByPlaceholder`, `getByText`, `getByDisplayValue`.
2.  **Semantic Queries**: `getByAltText`, `getByTitle`.
3.  **Test IDs**: `getByTestId`.

This will be codified in the `e2e` specification and applied to existing test files.

## Impact

- **Robustness**: Tests will be less sensitive to DOM structure changes.
- **Accessibility**: Encourages using accessible roles and labels in the UI.
- **Maintainability**: Clearer intent in test code.
