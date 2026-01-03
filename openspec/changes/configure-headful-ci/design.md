# Design: Headful CI with Playwright

## Architecture

The E2E tests are designed to load the browser extension from the `dist/v3` directory. This requires a build step prior to running the tests.

In GitHub Actions:

- **Environment:** `ubuntu-latest`.
- **Display:** `xvfb-run` will be used to wrap the test execution command. `xvfb` (X Virtual Framebuffer) mimics a physical display in memory.
- **Dependencies:** `npx playwright install --with-deps chromium` will be used to ensure Chromium and its system dependencies are present.

## Workflow Integration

A new `e2e` job will be added to `.github/workflows/ci.yml`. This job will:

1. Checkout the code.
2. Setup Node.js.
3. Install dependencies.
4. Build the extension (`npm run build`).
5. Install Playwright Chromium and dependencies (`npx playwright install --with-deps chromium`).
6. Run tests using `xvfb-run npm run test:e2e`.

Using `xvfb-run` ensures that Playwright can launch a headful browser instance in the Linux CI runner.
The existing `test` job in `ci.yml` will remain as is (focused on unit tests) to keep feedback fast for unit test failures.

## Dependencies

- `xvfb` (provided by `xvfb-run` on GitHub Actions runners)
- Playwright Chromium browsers
