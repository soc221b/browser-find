# e2e Specification Delta

## MODIFIED Requirements

### Requirement: E2E Locator Priority

E2E tests MUST prioritize locators in the following order:

1. `page.getByRole()`
2. `page.getByLabel()`
3. `page.getByPlaceholder()`
4. `page.getByText()`
5. `page.getByDisplayValue()`
6. `page.getByAltText()`
7. `page.getByTitle()`
8. `page.getByTestId()`

**Tests MUST prefer accessibility-based locators and standard ARIA attributes over implementation-specific attributes (like `data-*`) for verifying state.**

#### Scenario: Testing toggle state

- **When** verifying the state of a toggle button.
- **Then** the test MUST use `aria-pressed` or `getByRole('button', { pressed: boolean })` instead of `data-*` attributes.
