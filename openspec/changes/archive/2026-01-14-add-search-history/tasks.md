## 1. State Management

- [x] 1.1 Update `State` interface in `src/pages/content/state/index.ts` to include `history: SearchSnapshot[]`, `historyIndex: number`, and `lastCommittedText: string`.
- [x] 1.2 Update `initialState` in `src/pages/content/state/index.ts`.

## 2. Actions and Types

- [x] 2.1 Update `src/pages/content/action/index.ts` to include `Undo`, `Redo`, and `CommitHistory` action types.
- [x] 2.2 Define `SearchSnapshot` type in `src/pages/content/state/index.ts`.

## 3. Undo/Redo Implementation (Red-Green-Refactor)

### Undo Reducer

- [x] 3.1 **Red**: Create `src/pages/content/reducer/__tests__/undo.test.ts` with tests for undoing text changes, including persistence after close/open.
- [x] 3.2 **Green**: Implement `src/pages/content/reducer/undo.ts` and register it in `src/pages/content/reducer/index.ts`.
- [x] 3.3 **Refactor**: Optimize history stack management.

### Redo Reducer

- [x] 3.4 **Red**: Create `src/pages/content/reducer/__tests__/redo.test.ts` with tests for redoing text changes.
- [x] 3.5 **Green**: Implement `src/pages/content/reducer/redo.ts` and register it in `src/pages/content/reducer/index.ts`.
- [x] 3.6 **Refactor**: Ensure redo stack is cleared correctly on new commits.

## 4. History Tracking & Granularity (Red-Green-Refactor)

### Input History Commit

- [x] 4.1 **Red**: Add test case to `src/pages/content/reducer/__tests__/commit-history.test.ts` verifying that committing pushes to history.
- [x] 4.2 **Green**: Implement `src/pages/content/reducer/commit-history.ts` to push `lastCommittedText` to history and update it to the current text.
- [x] 4.3 **Refactor**: Ensure history limit of 100 is enforced.

### Granularity Logic

- [x] 4.4 **Red**: Create tests in `src/pages/content/hooks/__tests__/use-history-tracking.test.ts` verifying that input is grouped by word boundaries and pauses.
- [x] 4.5 **Green**: Implement a hook or middleware to dispatch `CommitHistory` based on OS-like granularity rules (pause, word boundary).
- [x] 4.6 **Refactor**: Fine-tune debounce timers and boundary detection.

## 5. User Interface and OS-Specific Shortcuts

- [x] 5.1 Implement `getPlatform` utility to detect macOS vs others.
- [x] 5.2 Update `src/pages/content/components/_HotKey.tsx` to listen for platform-specific shortcuts (`Cmd+Z` vs `Ctrl+Z`, etc.).
- [x] 5.3 Ensure `preventDefault()` is called on native undo/redo events when the input is focused and history is available.

## 6. Verification

- [x] 6.1 Run all unit tests: `npm test`.
- [x] 6.2 Add E2E tests for undo/redo in `e2e/undo-redo.spec.ts` covering persistence and shortcuts.
- [x] 6.3 Run E2E tests: `npx playwright test e2e/undo-redo.spec.ts`.
