## Context

This design document outlines the strategy for implementing end-to-end (e2e) tests for the minimap functionality. The goal is to ensure robust and maintainable tests that are resilient to minor UI changes.

## Goals

- Implement e2e tests for the minimap that are reliable and easy to maintain.
- Prioritize test stability by using an accessibility-first locator strategy.
- Ensure tests accurately reflect user interaction and expected behavior.

## Decisions

- **Locator Strategy:** Adopt an accessibility-first locator strategy for all e2e tests related to the minimap. This means prioritizing locators that map to ARIA roles, labels, and text content (e.g., using Playwright's `getByRole`, `getByLabelText`, `getByText` or similar methods provided by the testing framework).
- **Scope:** This strategy will be applied to all new tests being scaffolded for the minimap functionality as part of this change.

## Risks / Trade-offs

- **Risk:** Elements might lack sufficient accessibility attributes (e.g., `role`, `aria-label`, `name`), requiring modifications to the application's HTML to support this locator strategy.
- **Trade-off:** While initial implementation might require more effort if accessibility attributes are missing, tests based on a11y locators are generally more stable and less prone to breaking due to visual changes compared to CSS or XPath locators.

## Open Questions

- What is the specific testing framework used for e2e tests (e.g., Playwright, Cypress)? This will inform the exact syntax for a11y locators. (Assuming Playwright based on `playwright.config.ts` in the project structure).
