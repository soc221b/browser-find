# Change: Add Search History (Undo/Redo)

## Why

Users currently lack the ability to easily revert accidental changes to their search query or toggle settings. Navigating back through recent search states improves the usability of the find feature, especially when dealing with complex queries or accidental keystrokes.

## What Changes

- **Add History State**: The application state will now include a history stack of up to 100 previous search configurations (text only).
- **Undo/Redo Actions**: New `Undo` and `Redo` actions will allow traversing this history.
- **OS-Specific Keyboard Shortcuts**:
  - macOS: `Cmd+Z` for Undo, `Cmd+Shift+Z` for Redo.
  - Windows/Linux: `Ctrl+Z` for Undo, `Ctrl+Y` or `Ctrl+Shift+Z` for Redo.
- **State Persistence**: Search history is preserved when the find bar is closed and reopened within the same session.
- **OS-Like Granularity**: History snapshots are taken at logical intervals (e.g., after a short pause or word boundary), mimicking native OS text input behavior.

## Impact

- **Affected Specs**: `input`
- **Affected Code**:
  - `src/pages/content/state/index.ts`: Add `history` and `historyIndex`.
  - `src/pages/content/reducer/`: Add `undo.ts`, `redo.ts`; update `input.ts`.
  - `src/pages/content/components/_HotKey.tsx`: Add event listeners for undo/redo.
  - `src/pages/content/action/index.ts`: Add `Undo` and `Redo` action types.
