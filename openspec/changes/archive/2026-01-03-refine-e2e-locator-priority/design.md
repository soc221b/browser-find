# Design: Refine E2E Locator Priority

## Architecture Overview

The change involves updating the E2E specification and refactoring existing Playwright tests. Playwright's built-in locators (`getByRole`, `getByLabel`, etc.) already align well with `testing-library`'s philosophy.

## Locator Priority

We will adopt the following priority for locators in E2E tests:

1.  **`page.getByRole()`**: Top priority. Used for elements with semantic roles (button, textbox, checkbox, etc.).
2.  **`page.getByLabel()`**: For form fields associated with a label.
3.  **`page.getByPlaceholder()`**: For input fields with placeholders.
4.  **`page.getByText()`**: For non-interactive elements or when specific text is the target.
5.  **`page.getByDisplayValue()`**: For elements whose value is visible (like filled inputs).
6.  **`page.getByAltText()`**: For images.
7.  **`page.getByTitle()`**: For elements with a title attribute.
8.  **`page.getByTestId()`**: Last resort. Used when no other semantic locator is available or unique enough.

## Refactoring Strategy

1.  **Update Specification**: Add a new requirement to `openspec/specs/e2e/spec.md` defining this priority.
2.  **Identify Targets**: List all existing E2E specs and their current locators.
3.  **Enhance UI (if needed)**: Add roles, labels, or `data-testid` attributes to React components in `src/pages/content/components/` to support the new locators.
4.  **Refactor Tests**: Update `e2e/*.spec.ts` files to use the prioritized locators.
