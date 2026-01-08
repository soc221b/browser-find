## 1. Implementation

- [x] 1.1 Verify `find-next.ts` scrolling behavior
  - **Red**: None (already uses `true`).
  - **Green**: Confirm `scrollIntoViewIfNeeded(true)` is present in `src/pages/content/reducer/find-next.ts`.
  - **Refactor**: None.

- [x] 1.2 Update `find-previous.ts` scrolling behavior
  - **Red**: Verify current `scrollIntoView` behavior in tests.
  - **Green**: Change `scrollIntoView` to `scrollIntoViewIfNeeded(true)` in `src/pages/content/reducer/find-previous.ts`.
  - **Refactor**: None.

- [x] 1.3 Update `complete.ts` scrolling behavior
  - **Red**: Verify current `scrollIntoView` behavior in tests.
  - **Green**: Change `scrollIntoView` to `scrollIntoViewIfNeeded(true)` in `src/pages/content/reducer/complete.ts`.
  - **Refactor**: None.

- [x] 1.4 Add/Update E2E tests for `scrollIntoViewIfNeeded(true)`
  - **Red**: Create/update a test case where a match is already visible and verify no scroll occurs. Verify that a non-visible match is centered.
  - **Green**: Ensure tests pass.
  - **Refactor**: None.
