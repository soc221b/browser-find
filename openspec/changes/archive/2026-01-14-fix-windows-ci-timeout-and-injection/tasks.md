## 1. Implementation

### 1.1 Increase timeouts in `playwright.config.ts`

- [x] **Red**: Observe the current 30s timeout failure in CI logs.
- [x] **Green**: Update `playwright.config.ts` to set `timeout: 60000` and `expect: { timeout: 10000 }`.
- [x] **Refactor**: Verify the configuration is correctly applied.

### 1.2 Robust content script initialization in `src/pages/content/index.tsx`

- [x] **Red**: Add a test or simulate a scenario where the content script is injected after `DOMContentLoaded`.
- [x] **Green**: Update `src/pages/content/index.tsx` to check `document.readyState` and initialize immediately if needed.
- [x] **Refactor**: Ensure `init` is idempotent (e.g., check if container already exists).

### 1.3 Synchronize extension readiness in `e2e/fixtures.ts`

- [x] **Red**: Observe that `loadFixture` might run before the extension is ready.
- [x] **Green**: Update `loadFixture` to depend on `extensionId`.
- [x] **Refactor**: Ensure the `userDataDir` path is cleanly resolved.
