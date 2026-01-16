## 1. Implementation

### 1.1 Fix fixture loading in `e2e/fixtures.ts`

- [x] **Red**: Run E2E tests on a Windows environment (if possible) and observe failures. Since I cannot run Windows tests here, I will rely on the CI logs provided by the user.
- [x] **Green**: Update `e2e/fixtures.ts` to use `pathToFileURL` from the `url` module to generate fixture URLs.
- [x] **Refactor**: Ensure imports are clean and the code follows project conventions.

### 1.2 Verify `userDataDir` path

- [x] **Green**: Ensure `userDataDir` is correctly resolved using `path.resolve` or `path.join`.

### 1.3 Update Playwright config for CI stability

- [x] **Green**: Increase the expectation timeout in `playwright.config.ts` if it helps with CI stability.
