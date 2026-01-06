# Change: Add E2E tests for visual highlighting of search matches

## Why

To ensure that search matches are correctly highlighted with the appropriate colors (orange for the active match and yellow for others) across different user actions (initial search, navigating next, and navigating previous). This improves the reliability of the visual feedback provided to the user.

## What Changes

- Implement E2E tests to verify `CSS.highlights` content and their associated styles.
- Add test cases to `e2e/input.spec.ts` for initial search highlighting.
- Add test cases to `e2e/find-next.spec.ts` for highlighting after "Next" action.
- Add test cases to `e2e/find-previous.spec.ts` for highlighting after "Previous" action.

## Impact

- Affected specs: `input`, `find-next`, `find-previous`
- Affected code: `e2e/input.spec.ts`, `e2e/find-next.spec.ts`, `e2e/find-previous.spec.ts`
