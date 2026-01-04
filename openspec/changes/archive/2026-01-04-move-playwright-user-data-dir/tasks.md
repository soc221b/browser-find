## 1. Implementation

- [x] 1.1 Update `userDataDir` in `e2e/fixtures.ts`
  - **Red**: Modify the test fixture to expect the new path (this is hard to test "Red" in a traditional sense without running playwright, but we can verify the path calculation).
  - **Green**: Update `e2e/fixtures.ts` to use `path.join(__dirname, "../node_modules/.playwright/user-data-${workerInfo.workerIndex}")`.
  - **Refactor**: Ensure the path is constructed cleanly.
- [x] 1.2 Update `.gitignore`
  - **Red**: N/A
  - **Green**: Add `/.playwright-user-data*` to `.gitignore` and remove `/.playwright-user-data`.
  - **Refactor**: Keep `.gitignore` organized.

## 2. Verification

- [x] 2.1 Run E2E tests to ensure they still pass and create the directory in the new location.
  - `npm test` (which runs playwright).
