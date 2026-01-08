## 1. Implementation

### 1.1 Update FindNext Reducer (Red-Green-Refactor)

- [x] 1.1.1 **Red:** Add E2E test cases to `e2e/find-next.spec.ts`:
  - [x] 1.1.1.1 Discover matches from 0: Start with no matches, add content, click "Next".
  - [x] 1.1.1.2 Discover new matches from 1: Start with 1 match, add content, click "Next".
  - [x] 1.1.1.3 Discover new matches on wrap around: Start with 2 matches, focus second, add content, click "Next".
- [x] 1.1.2 **Green:** Update `src/pages/content/reducer/find-next.ts` to trigger re-search if `found.length <= 1` or if wrapping around.
- [x] 1.1.3 **Refactor:** Ensure the logic is clean and doesn't interfere with the "match missing" recovery.

### 1.2 Update FindPrevious Reducer (Red-Green-Refactor)

- [x] 1.2.1 **Red:** Add E2E test cases to `e2e/find-previous.spec.ts`:
  - [x] 1.2.1.1 Discover matches from 0: Start with no matches, add content, click "Previous".
  - [x] 1.2.1.2 Discover new matches from 1: Start with 1 match, add content, click "Previous".
  - [x] 1.2.1.3 Discover new matches on wrap around: Start with 2 matches, focus first, add content, click "Previous".
- [x] 1.2.2 **Green:** Update `src/pages/content/reducer/find-previous.ts` to trigger re-search if `found.length <= 1` or if wrapping around.
- [x] 1.2.3 **Refactor:** Ensure consistency with `find-next`.

### 1.3 Update UI Components

- [x] 1.3.1 Enable "Find Next" and "Find Previous" buttons even when `found.length === 0`.

## 2. Verification

- [x] 2.1 Run E2E tests: `npm run test:e2e`
- [x] 2.2 Verify no infinite loops by manually testing a page where search text doesn't exist.
