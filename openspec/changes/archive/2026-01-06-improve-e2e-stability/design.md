# Design: Improve E2E Stability

## Context

The initial E2E implementation used some patterns that can lead to flakiness or maintenance overhead, such as hardcoded `waitForTimeout` and custom platform detection for modifier keys.

## Goals

- Eliminate flakiness by using web-first assertions.
- Simplify test code by using Playwright's built-in platform-agnostic modifier keys.
- Increase test reliability by using high-discrimination scenarios.

## Decisions

### Decision: Use `ControlOrMeta` for Modifier Keys

Instead of a custom `getModifier` fixture that detects the OS, we will use Playwright's `ControlOrMeta` modifier. This is a built-in feature that maps to `Command` on macOS and `Control` on Windows/Linux, making the tests more readable and less prone to custom detection errors.

### Decision: Prefer Web-First Assertions over `waitForTimeout`

Hardcoded delays are a major source of flakiness. We will enforce the use of `expect(locator).toBeVisible()` and similar assertions which automatically retry until the condition is met or a timeout is reached.

### Decision: High-Discrimination Fixtures

Fixtures should be designed such that matches are distinct and can be counted accurately. We will use `getHighlightCounts` to verify the internal state of `CSS.highlights` to ensure the extension is correctly identifying and highlighting matches, rather than just relying on the status text in the UI.

## Risks / Trade-offs

- **Risk**: Some UI changes might be too fast for `expect(locator).toBeVisible()` if the element is removed and re-added quickly.
- **Mitigation**: Use `expect.poll()` or `expect().toPass()` for more complex state transitions if necessary.
