## Context

The previous change `handle-missing-match-on-navigation` introduced a recovery mechanism that re-triggers search when the _current_ target match is invalid. This change extends that logic to handle cases where _new_ matches might have appeared, even if existing matches are still valid.

## Goals

- Allow discovery of new matches when "Find Next" or "Find Previous" is clicked.
- Handle the case where the initial search found 0 matches but new content now exists.
- Handle the case where a single match was found and user wants to check if more appeared.

## Decisions

### Triggering Re-search

We will trigger a re-search (incrementing `searchVersion` and setting `pendingNavigation`) in the following scenarios:

1. **Zero matches:** When `found.length === 0`.
2. **Single match:** When `found.length === 1`.
3. **Wrapping around:** When navigating from the last match to the first (Next) or first to last (Previous).

This ensures that whenever the user might be "stuck" or "looping", we give the system a chance to refresh the matches.

### Anchor Position

When triggering a re-search from 0 or 1 match, we should use the current selection or the single match's position as an anchor to ensure we find the "next" match relative to where the user is.

## Risks / Trade-offs

- **Performance:** Re-searching on every wrap-around might be slightly expensive on very large pages, but since it's user-triggered navigation, it should be acceptable.
- **State Loops:** We must ensure that if no _new_ matches are found after re-search, we don't end up in an infinite re-search loop. The `pendingNavigation` flag should be cleared after the search completes, regardless of whether new matches were found.
