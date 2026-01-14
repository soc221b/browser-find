# Design: Search History

## Context

The browser's native `<input>` element provides undo/redo for text content. However, our search state includes more than just text (case sensitivity, regex, whole word), and the requirement specifies support for "every search" and a history depth of up to 100 records.

## Goals

- Support Undo/Redo for text input with OS-specific shortcuts.
- Maintain a history of up to 100 entries per page load, persisting through close/open cycles.
- Mimic native OS text input granularity for recording history.
- Ensure the Undo/Redo behavior feels natural and consistent with standard editor behavior.

## Decisions

### 1. Custom History Management

We will manage history explicitly in the Redux-like state store.

- **Reason**: We want to maintain a consistent history depth (100) and ensure persistence across find bar visibility toggles.
- **Mechanism**:
  - `State` will store `history: SearchSnapshot[]` and `historyIndex: number`.
  - `SearchSnapshot` contains `text: string`.
  - Future history (redo stack) is cleared on new changes.

### 2. Interaction with Native Undo

When the user presses Undo/Redo shortcuts in the focused input:

- We will `preventDefault()` to stop the browser's native undo/redo.
- We will dispatch our own `Undo`/`Redo` actions.
- Shortcuts are platform-aware:
  - macOS: `metaKey + Z`, `metaKey + shiftKey + Z`.
  - Others: `ctrlKey + Z`, `ctrlKey + Y` or `ctrlKey + shiftKey + Z`.

### 3. Persistence

Since the Zustand store is created at the module level in `src/pages/content/store/index.ts`, it survives as long as the content script is active on the page. Closing the find bar (setting `open: false`) does not unmount the store, so the history naturally persists.

### 4. History Granularity

Instead of recording every single keystroke, we will group input actions into logical "undo steps" to match OS expectations:

- **Triggers for new snapshot**:
  - Word boundary (e.g., space or punctuation).
  - A pause in typing (e.g., 500ms).
  - Deletion of a large block of text.
- **Implementation**: We will use a debounce/timer mechanism to commit "pending" input changes to the history stack.

## Data Structures

```typescript
type SearchSnapshot = {
  text: string;
};

type State = {
  // ... existing fields
  history: SearchSnapshot[];
  historyIndex: number;
  lastCommittedText: string; // Used to track granularity
};
```

## Risks

- **Performance**: Storing 100 snapshots of small strings and booleans is negligible in memory.
- **UX**: Character-by-character undo can be tedious. However, it is consistent with "undoing the last search" if every character triggers a search. Ideally, we might debounce or group, but the requirement is "every search". We will stick to the literal interpretation first.
