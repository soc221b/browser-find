# Tasks: Refine E2E Locator Priority

- [ ] **Phase 1: Specification Update**
  - [x] Update `openspec/specs/e2e/spec.md` with the locator priority requirement.
  - [x] Validate the proposal with `openspec validate refine-e2e-locator-priority --strict`.

- [x] **Phase 2: UI Enhancements for Accessibility**
  - [x] Add `placeholder="Search"` and `aria-label="Search"` to `Input.tsx`.
  - [x] Add `aria-label="Close"` to `Close.tsx`.
  - [x] Add `aria-label="Find Next"` to `FindNext.tsx`.
  - [x] Add `aria-label="Find Previous"` to `FindPrevious.tsx`.
  - [x] Add `aria-label="Match Case"` to `ToggleMatchCase.tsx`.
  - [x] Add `aria-label="Match Whole Word"` to `ToggleMatchWholeWord.tsx`.
  - [x] Add `aria-label="Use Regular Expression"` to `ToggleUseRegularExpression.tsx`.
  - [x] Ensure `Result.tsx` can be located by role or text.

- [x] **Phase 3: Test Refactoring**
  - [x] Refactor `e2e/close.spec.ts`.
  - [x] Refactor `e2e/input.spec.ts`.
  - [x] Refactor `e2e/find-next.spec.ts`.
  - [x] Refactor `e2e/find-previous.spec.ts`.
  - [x] Refactor `e2e/show.spec.ts`.
  - [x] Refactor `e2e/toggle-match-case.spec.ts`.
  - [x] Refactor `e2e/toggle-match-whole-word.spec.ts`.
  - [x] Refactor `e2e/toggle-use-regular-expression.spec.ts`.

- [x] **Phase 4: Validation**
  - [x] Run all E2E tests: `npx playwright test`.
  - [x] Verify that no CSS-based locators remain where semantic ones are possible.
