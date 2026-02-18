# Change: Optimize CI Playwright Installation

## Why

Installing Playwright browsers and dependencies in CI currently takes about 4 minutes per run, which is slow and costly. We can significantly reduce this time by caching the browsers and using built-in GitHub Actions caching for npm dependencies.

## What Changes

- Add `cache: 'npm'` to `actions/setup-node` across all jobs to speed up `npm ci`.
- Add caching for Playwright browsers using `actions/cache`.
- Only install Playwright browsers if there is a cache miss.
- Ensure system dependencies are still installed when needed (using `npx playwright install-deps chromium`).

## Impact

- Affected specs: `openspec/specs/ci/spec.md`
- Affected code: `.github/workflows/ci.yml`
