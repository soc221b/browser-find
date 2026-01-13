# Design: Fix Windows CI E2E Timeout

## Context

Playwright E2E tests are failing on Windows CI but passing on Linux and macOS. The failures are reported as timeouts in `e2e/close.spec.ts`, but likely affect all tests.

## Decisions

### 1. Use `pathToFileURL` for fixtures

Windows paths like `C:\path\to\file.html` don't always work when prefixed with `file://` (resulting in `file://C:\path\to\file.html`). The correct format is `file:///C:/path/to/file.html`. Node.js's `pathToFileURL` from the `url` module handles this correctly across all platforms.

### 2. Standardize `userDataDir`

The current `userDataDir` is located in `node_modules/.playwright/user-data-${workerIndex}`. We will ensure this path is correctly resolved on Windows using `path.resolve`.

### 3. Increase Timeout for CI

If Windows CI is slower, we might need to increase the default timeout specifically for CI environments.

## Risks / Trade-offs

- Using `pathToFileURL` is the recommended way in Playwright/Node.js for loading local files and has no known downsides.
