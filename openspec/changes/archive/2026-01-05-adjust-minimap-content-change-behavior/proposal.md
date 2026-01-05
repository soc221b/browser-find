# Change: Adjust Minimap Content Change Behavior

## Why

The current behavior automatically re-scans the entire document for matches whenever dynamic content is added. This can be distracting or performance-intensive. The desired behavior is to maintain the positions of existing matches (updating them as they move) but _not_ automatically highlight new matches in dynamically added content unless the user explicitly triggers a re-search.

## What Changes

- Stop the automatic re-execution of the search algorithm when the DOM mutates.
- Ensure the minimap continues to update the vertical positions of _existing_ matches when the document layout changes (e.g., height increases due to new content).
- Update the specification and tests to reflect that new content containing the search term will NOT be automatically highlighted.

## Impact

- **Affected Specs**: `minimap`
- **Affected Code**: `src/pages/content/components/_Find.tsx` (removes `MutationObserver` logic), `e2e/minimap.spec.ts` (updates expectations).
