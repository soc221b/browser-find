# Tasks: Add Core E2E Tests

## Infrastructure

- [x] Create HTML fixtures for testing under `e2e/fixtures/`
  - [x] `simple.html`: Basic text for searching.
  - [x] `regex.html`: Content for regex testing.
  - [x] `filters.html`: Content for case/whole word testing.
- [x] Update `e2e/fixtures.ts` to support loading local files via `file://`.

## Test Implementation

- [x] Implement `e2e/show.spec.ts` (Meta+F / Ctrl+F).
- [x] Implement `e2e/close.spec.ts` (Escape, Close Button).
- [x] Implement `e2e/input.spec.ts` (Text search).
- [x] Implement `e2e/toggle-match-case.spec.ts`.
- [x] Implement `e2e/toggle-match-whole-word.spec.ts`.
- [x] Implement `e2e/toggle-use-regular-expression.spec.ts`.
- [x] Implement `e2e/find-next.spec.ts`.
- [x] Implement `e2e/find-previous.spec.ts`.

## Cleanup & Validation

- [x] Refactor or remove `e2e/basic.spec.ts`.
- [x] Verify all tests pass with `npm run test:e2e`.
