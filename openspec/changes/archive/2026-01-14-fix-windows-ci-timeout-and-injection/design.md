## Context

Windows CI runners in GitHub Actions can be significantly slower than local machines or Linux runners when launching headful browsers with extensions. This leads to timeouts during the initial setup phase of tests.

## Goals

- Eliminate "Target page, context or browser has been closed" errors by preventing timeouts.
- Ensure the extension is always injected, regardless of when the content script runs relative to the page lifecycle.
- Guarantee that `loadFixture` only proceeds once the extension is actually ready to inject.

## Decisions

### 1. Increase Global Timeouts

We will increase the test timeout to 60 seconds and the expectation timeout to 10 seconds. This provides more buffer for slow CI environments without severely impacting local development speed (since successful tests will still finish fast).

### 2. Extension Readiness Sync

The `loadFixture` fixture will now depend on `extensionId`. Since `extensionId` waits for the service worker, this ensures the extension is at least partially loaded by Chromium before we attempt to navigate to a fixture.

### 3. Robust Content Script Initialization

In `src/pages/content/index.tsx`, we will check `document.readyState`. If it's already `interactive` or `complete`, we call `init()` immediately. Otherwise, we wait for `DOMContentLoaded`. This handles cases where the extension might be reloaded or injected late.

```typescript
function init() {
  if (document.getElementById("browser-find-top-layer")) return;
  // ... injection logic
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
```

### 4. User Data Directory Stability

We will use a consistently resolved absolute path for `userDataDir` and ensure it's unique per worker.

## Risks / Trade-offs

- **Risk**: Increased timeouts might hide genuine performance regressions.
  - **Mitigation**: We only increase them for CI/global config; local runs can still be fast.
- **Risk**: `file://` access might still be an issue for extensions.
  - **Mitigation**: If timeouts don't fix it, we will move to a local HTTP server for fixtures in a subsequent change.
