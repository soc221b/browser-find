# Proposal: Configure CI to run Playwright in headful mode

## Problem

The browser extension requires headful mode to be loaded and tested correctly by Playwright. Currently, the CI workflow does not run E2E tests, and standard CI environments (like GitHub Actions runners) do not have a display attached, which causes headful browsers to fail.

## Proposed Solution

1. Update `.github/workflows/ci.yml` to include an E2E testing job.
2. Use `xvfb-run` to provide a virtual display for Playwright in the CI environment.
3. Ensure the extension is built before running E2E tests.
4. Install Playwright browsers in the CI environment.

## Impact

- **Developer Experience:** E2E tests will automatically run on every push and PR, ensuring that the extension's core functionality (like the find bar) remains intact.
- **CI/CD Pipeline:** The CI pipeline will take longer to run due to building and running E2E tests, but it will provide higher confidence.
