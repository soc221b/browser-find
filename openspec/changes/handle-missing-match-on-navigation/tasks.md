## 1. Implementation

### 1.1 Update State

- [x] 1.1.1 Add `searchVersion: number` and `pendingNavigation: 'next' | 'previous' | null` to `State` in `src/pages/content/state/index.ts`.
- [x] 1.1.2 Initialize `searchVersion` to `0` and `pendingNavigation` to `null` in `initialState`.

### 1.2 Update \_Find Component

- [x] 1.2.1 Update `src/pages/content/components/_Find.tsx` to include `searchVersion` in the `useEffect` dependency array.

### 1.3 Implement Match Validation Utility

- [x] 1.3.1 Create `src/pages/content/utils/is-match-valid.ts` that checks if a match's ranges are connected to the DOM and not collapsed.

### 1.4 Update FindNext Reducer (Red-Green-Refactor)

- [x] 1.4.1 **Red:** Add E2E test cases to `e2e/find-next.spec.ts`:
  - [x] 1.4.1.1 Target match missing: Remove the next match from DOM before clicking "Find Next".
  - [x] 1.4.1.2 All matches missing: Remove all matches from DOM before clicking "Find Next".
  - [x] 1.4.1.3 Matches replaced: Remove all matches and add new ones before clicking "Find Next".
- [x] 1.4.2 **Green:** Update `src/pages/content/reducer/find-next.ts` to use `isMatchValid`. If invalid, increment `searchVersion` and set `pendingNavigation` to `'next'`.
- [x] 1.4.3 **Refactor:** Clean up the logic and ensure it handles wrapping correctly during recovery.

### 1.5 Update FindPrevious Reducer (Red-Green-Refactor)

- [x] 1.5.1 **Red:** Add E2E test cases to `e2e/find-previous.spec.ts`:
  - [x] 1.5.1.1 Target match missing: Remove the previous match from DOM before clicking "Find Previous".
  - [x] 1.5.1.2 All matches missing: Remove all matches from DOM before clicking "Find Previous".
  - [x] 1.5.1.3 Matches replaced: Remove all matches and add new ones before clicking "Find Previous".
- [x] 1.5.2 **Green:** Update `src/pages/content/reducer/find-previous.ts` to use `isMatchValid`. If invalid, increment `searchVersion` and set `pendingNavigation` to `'previous'`.
- [x] 1.5.3 **Refactor:** Ensure consistency with `find-next` logic.

### 1.6 Update Complete Reducer (Red-Green-Refactor)

- [x] 1.6.1 **Red:** Verify the E2E tests from 1.4 and 1.5 fail as expected (they should trigger re-search but not yet navigate).
- [x] 1.6.2 **Green:** Update `src/pages/content/reducer/complete.ts` to check `pendingNavigation` at the end of the search. If set, execute the next/previous logic and clear the flag.
- [x] 1.6.3 **Refactor:** Optimize to avoid redundant scrolling or highlighting.

## 2. Verification

- [x] 2.1 Run E2E tests: `npm run test:e2e`
