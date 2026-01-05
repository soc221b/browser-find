## 1. Implementation

- [x] 1.1 Update `e2e/minimap.spec.ts`
  - [x] Red: Change `should update when dynamic content is added` to expect match count to remain constant (12) instead of increasing (18) after adding content.
- [x] 1.2 Modify `src/pages/content/components/_Find.tsx`
  - [x] Green: Remove the `MutationObserver` and the `version` state that triggers automatic re-search on DOM changes.
- [x] 1.3 Verify and Refactor
  - [x] Run all e2e tests to ensure no regressions in other functionalities (like basic search).
