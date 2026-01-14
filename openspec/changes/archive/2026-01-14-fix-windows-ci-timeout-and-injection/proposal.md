# Change: Fix Windows CI Timeout and Injection

## Why

The E2E tests are consistently failing on Windows CI due to timeouts and apparent failures in extension injection. The key issues are:

1.  **Insufficient Timeouts**: The default 30s timeout is too short for the first test run in a fresh Windows CI environment, especially when loading a Chrome extension for the first time.
2.  **Race Condition in Injection**: `loadFixture` navigates to the page and immediately waits for the `#browser-find-top-layer`. If the extension's service worker or content script hasn't fully initialized, the injection might be delayed or fail if it misses the `DOMContentLoaded` event.
3.  **Content Script Loading**: The content script currently only runs on `DOMContentLoaded`. If it's injected after this event, it won't initialize.
4.  **Browser Crashes/Early Closure**: Test timeouts during `beforeEach` lead to context closure, resulting in "Target page, context or browser has been closed" errors which obscure the root cause.

## What Changes

- **Increase Timeouts**: Boost global test and expectation timeouts in `playwright.config.ts`.
- **Synchronize Extension Readiness**: Update `e2e/fixtures.ts` to ensure `loadFixture` waits for the extension service worker to be active before navigating.
- **Robust Content Script Initialization**: Update `src/pages/content/index.tsx` to initialize immediately if `document.readyState` is already `interactive` or `complete`.
- **Reliable User Data Directory**: Ensure `userDataDir` is absolute and resides in a clean, predictable location.

## Impact

- Affected specs: `specs/ci/spec.md`, `specs/e2e/spec.md`
- Affected code: `playwright.config.ts`, `e2e/fixtures.ts`, `src/pages/content/index.tsx`
