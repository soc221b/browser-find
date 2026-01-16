# Change: Add Windows CI Support

## Why

The current CI pipeline only tests on Linux (ubuntu-latest). To ensure cross-platform compatibility, specifically that the extension opens and closes correctly on Windows, we need to add Windows to our testing matrix.

## What Changes

- Update the CI workflow to run E2E tests on Windows (`windows-latest`) in addition to Linux.
- Ensure E2E tests run without `xvfb-run` on Windows.

## Impact

- Affected specs: `ci`
- Affected code: `.github/workflows/ci.yml`
