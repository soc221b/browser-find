# Change: Handle new matches on navigation

## Why

Currently, the search results are static after the initial search unless a match becomes invalid (removed from DOM). However, in dynamic web applications (e.g., infinite scroll, dynamic content loading), new matches may appear after the search is completed. The user should be able to find these new matches when navigating, especially in edge cases like starting from zero matches or wrapping around when only one match was previously found.

## What Changes

- **Reducers:**
  - `FindNext`:
    - If no matches exist, trigger a re-search and set `pendingNavigation` to `'next'`.
    - If only one match exists, trigger a re-search and set `pendingNavigation` to `'next'`.
    - (Optional/Refinement) If wrapping around from the last match to the first, trigger a re-search.
  - `FindPrevious`:
    - If no matches exist, trigger a re-search and set `pendingNavigation` to `'previous'`.
    - If only one match exists, trigger a re-search and set `pendingNavigation` to `'previous'`.
    - (Optional/Refinement) If wrapping around from the first match to the last, trigger a re-search.

## Impact

- Affected specs: `find-next`, `find-previous`
- Affected code: `src/pages/content/reducer/find-next.ts`, `src/pages/content/reducer/find-previous.ts`
