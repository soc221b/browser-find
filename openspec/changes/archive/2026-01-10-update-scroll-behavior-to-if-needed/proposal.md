# Change: Update Scroll Behavior to use "scrollIntoViewIfNeeded(true)"

## Why

Currently, the scrolling behavior is inconsistent: `find-next` uses `scrollIntoViewIfNeeded(true)`, while other actions use `scrollIntoView({ block: 'nearest' })`. To provide a consistent experience across the entire extension, all scrolling should use `scrollIntoViewIfNeeded(true)`, ensuring matches are centered in the viewport when they are not already visible.

## What Changes

- Standardize all scrolling to use `scrollIntoViewIfNeeded(true)`.
- Update `find-previous` and the completion logic (initial search) to use `scrollIntoViewIfNeeded(true)` instead of `scrollIntoView`.
- Ensure `find-next` continues to use `scrollIntoViewIfNeeded(true)`.
- Document this requirement in the specifications.

## Impact

- **Consistency**: All navigation actions will use the same `scrollIntoViewIfNeeded(true)` method.
- **User Experience**: Matches that are already visible will not cause any scrolling. Matches that are not visible will be centered in the viewport.
- **Affected files**:
  - `src/pages/content/reducer/find-next.ts`
  - `src/pages/content/reducer/find-previous.ts`
  - `src/pages/content/reducer/complete.ts`
- **Affected specs**:
  - `find-next`
  - `find-previous`
  - `input`
