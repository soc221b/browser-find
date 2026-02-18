## 1. Implementation

- [x] 1.1 Update `format` job in `.github/workflows/ci.yml` to use `cache: 'npm'` with `actions/setup-node`.
- [x] 1.2 Update `test` job in `.github/workflows/ci.yml` to use `cache: 'npm'` with `actions/setup-node`.
- [x] 1.3 Update `build` job in `.github/workflows/ci.yml` to use `cache: 'npm'` with `actions/setup-node`.
- [x] 1.4 Update `e2e` job in `.github/workflows/ci.yml` to use `cache: 'npm'` with `actions/setup-node`.
- [x] 1.5 Add a step to get the Playwright version from `package-lock.json` in the `e2e` job.
- [x] 1.6 Add `actions/cache` step in the `e2e` job for Playwright browsers.
- [x] 1.7 Modify the Playwright installation step in the `e2e` job to conditionally install browsers and always install system dependencies.
- [x] 1.8 Verify the changes by checking the `ci.yml` file and ensuring it follows the planned structure.
