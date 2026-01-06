## 1. Preparation

- [x] 1.1 Identify all instances of `page.waitForTimeout` and `getModifier` in `e2e/*.spec.ts`.

## 2. Implementation: Playwright Framework Integration (Modifier Keys)

- [x] 2.1 **Red**: Update `e2e/show.spec.ts` and `e2e/toggle-use-regular-expression.spec.ts` to use `ControlOrMeta+f` instead of `${modifier}+f`.
- [x] 2.2 **Green**: Ensure the tests pass on the current platform using the standard Playwright mapping.
- [x] 2.3 **Refactor**: Remove `getModifier` from `e2e/fixtures.ts` and all other spec files.

## 3. Implementation: Test Stability and Robustness (Wait Patterns)

- [x] 3.1 **Red**: Remove `page.waitForTimeout(500)` from `e2e/show.spec.ts` and ensure it still passes (if it fails, identify what it should wait for specifically using web-first assertions).
- [x] 3.2 **Green**: Ensure `e2e/show.spec.ts` is stable without hardcoded delays.
- [x] 3.3 **Refactor**: Systematically remove `page.waitForTimeout` from all other E2E tests, replacing them with appropriate `expect(locator).toBeVisible()` or `expect(locator).toHaveText()` assertions.

## 4. Implementation: High-Discrimination Test Scenarios

- [x] 4.1 **Red**: Update fixtures for `toggle-use-regular-expression`, `toggle-match-case`, and `toggle-match-whole-word` to use varied text that results in distinct `thisCount` and `theOthersCount` (e.g., matching words of different lengths).
- [x] 4.2 **Green**: Update the corresponding specs to verify accurate highlight counts using `getHighlightCounts()`.
- [x] 4.3 **Red**: Update `find-next.fixture.html` and `find-previous.fixture.html` to use non-uniform match lengths (e.g., `apple pineapple apple`).
- [x] 4.4 **Green**: Update `find-next.spec.ts` and `find-previous.spec.ts` to strictly verify counts as they cycle through matches.
- [x] 4.5 **Refactor**: Ensure all E2E tests follow this pattern of verifying non-trivial counts and states where possible.
