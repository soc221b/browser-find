# Tasks: Refactor E2E Tests to Use Accessibility Locators

- [x] **Phase 1: Component and Style Refactoring**
  - [x] Update `src/pages/content/components/ToggleMatchCase.tsx` to use `aria-pressed` instead of `data-active`.
  - [x] Update `src/pages/content/components/ToggleMatchWholeWord.tsx` to use `aria-pressed` instead of `data-active`.
  - [x] Update `src/pages/content/components/ToggleUseRegularExpression.tsx` to use `aria-pressed` instead of `data-active`.
  - [x] Update `src/pages/content/components/_StyleSheet.tsx` to target `[aria-pressed='true']`.
  - [x] Verify UI still looks correct in development.

- [x] **Phase 2: E2E Test Refactoring**
  - [x] Update `e2e/toggle-match-case.spec.ts` to use `aria-pressed` locators.
  - [x] Update `e2e/toggle-match-whole-word.spec.ts` to use `aria-pressed` locators.
  - [x] Update `e2e/toggle-use-regular-expression.spec.ts` to use `aria-pressed` locators.
  - [x] Run all E2E tests to ensure they pass: `npx playwright test`.
