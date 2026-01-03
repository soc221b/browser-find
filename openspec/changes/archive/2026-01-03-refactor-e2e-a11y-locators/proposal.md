# Proposal: Refactor E2E Tests to Use Accessibility Locators

## Problem

Current E2E tests for toggle buttons (Match Case, Whole Word, Regular Expression) rely on a custom `data-active` attribute to verify their state. This is not a standard accessibility attribute and doesn't reflect the experience of users with assistive technologies. Using standard ARIA attributes like `aria-pressed` is better for accessibility and makes tests more robust by aligning them with how users interact with the UI.

## Proposed Changes

1.  **Component Refactoring**: Replace the custom `data-active` attribute with the standard `aria-pressed` attribute in all toggle components.
2.  **Style Refactoring**: Update CSS selectors to target `[aria-pressed='true']` instead of `[data-active='true']`.
3.  **E2E Test Refactoring**: Update Playwright tests to use `aria-pressed` for state verification and prefer `getByRole` with the `pressed` option where applicable.
4.  **Specification Update**: Update OpenSpec requirements to include accessibility standards for interactive elements.

## Benefits

- **Improved Accessibility**: The extension becomes more accessible to users of screen readers and other assistive technologies.
- **Robust Testing**: Tests use semantic locators that are less likely to break during UI refactoring.
- **Standard Alignment**: Adheres to W3C ARIA standards for toggle buttons.
