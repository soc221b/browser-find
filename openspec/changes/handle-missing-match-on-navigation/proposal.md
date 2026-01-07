# Change: Handle missing match on navigation

## Why

Currently, if the DOM changes and elements containing search matches are removed, triggering "Find Next" or "Find Previous" might lead to broken behavior (e.g., trying to scroll to a detached element or not moving at all). The system should detect these cases and automatically re-search to recover and find the next/previous valid match relative to the last known position.

## What Changes

- **State:** Add `searchVersion: number` and `pendingNavigation: 'next' | 'previous' | null` to the state to track and trigger recovery searches.
- **Reducers:**
  - `FindNext` / `FindPrevious`: Add validation for the target match. If invalid, increment `searchVersion`, set `pendingNavigation`, and update `selection` to the current match's position to act as an anchor.
  - `Complete`: If `pendingNavigation` is set, execute the corresponding navigation logic after the new search finishes and reset the flag.
- **Components:**
  - `_Find`: Update to re-trigger the search when `searchVersion` changes.

## Impact

- Affected specs: `find-next`, `find-previous`
- Affected code: `src/pages/content/state/index.ts`, `src/pages/content/reducer/find-next.ts`, `src/pages/content/reducer/find-previous.ts`, `src/pages/content/reducer/complete.ts`, `src/pages/content/components/_Find.tsx`
