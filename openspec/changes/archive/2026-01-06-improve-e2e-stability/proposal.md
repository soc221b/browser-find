# Change: Improve E2E Stability and Robustness

## Why

Current E2E tests may be susceptible to flakiness due to timing issues or over-reliance on implementation details. We need to establish clear patterns for waiting (web-first assertions), locator strategy (accessibility-first), and cross-platform compatibility (modifier keys) to ensure a high-quality, reliable test suite that can run consistently across different environments.

## What Changes

- **MODIFIED** `Requirement: Playwright Framework Integration` to include platform-agnostic modifier keys requirement.
- **ADDED** `Requirement: Test Stability and Robustness` enforcing web-first assertions and forbidding hardcoded delays.
- **ADDED** `Requirement: High-Discrimination Test Scenarios` to ensure tests verify non-trivial behavior and accurate match counts.

## Impact

- Affected specs: `e2e`
- Affected code: `e2e/*.spec.ts`, `e2e/*.fixture.html`, `e2e/fixtures.ts`
