## Context

The extension relies on `Range` objects to track matches. These ranges become invalid if the underlying DOM nodes are removed or moved. When a user navigates to a match that no longer exists in the DOM, the extension should recover gracefully.

## Goals / Non-Goals

- **Goals:**
  - Detect invalid matches during "Find Next" and "Find Previous" operations.
  - Automatically re-search the DOM to update the match list.
  - Navigate to the next/previous valid match relative to the last known position after re-searching.
- **Non-Goals:**
  - Real-time DOM monitoring for changes (too expensive).
  - Perfect preservation of match IDs across re-searches.

## Decisions

- **Recovery Trigger:** Recovery is triggered on-demand during "Find Next" or "Find Previous" actions if the target match is detected as invalid. A match is invalid if any of its ranges are detached from the DOM (`isConnected === false`) or collapsed when they shouldn't be.
- **Anchor Point:** The `selection` state is used as an anchor point. Before triggering a re-search, the `selection` is updated to the position of the last valid match (the one currently highlighted, if still valid).
- **State Synchronization:**
  - `searchVersion`: Incremented to force the `_Find` component to re-execute the `find` use case.
  - `pendingNavigation`: A flag indicating if a "next" or "previous" operation should be automatically performed once the re-search completes.
- **Validation Utility:** A shared utility function will be created to consistently check match validity across reducers.

## Risks / Trade-offs

- **Performance:** Re-searching the entire DOM can be expensive on very large pages. However, this only happens when navigation fails, ensuring the feature remains functional.
- **Race Conditions:** If the user triggers multiple navigations while a re-search is in progress, we should ensure the `pendingNavigation` flag accurately reflects the most recent intent.
