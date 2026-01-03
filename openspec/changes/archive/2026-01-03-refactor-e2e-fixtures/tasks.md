## 1. Preparation

- [x] 1.1 Analyze current `e2e/fixtures/*.html` usage in all spec files.

## 2. Implementation

- [x] 2.1 Update `e2e/fixtures.ts` to load fixtures from the `e2e/` root directory.
- [x] 2.2 Create `e2e/close.fixture.html` and refactor `e2e/close.spec.ts`.
- [x] 2.3 Create `e2e/find-next.fixture.html` and refactor `e2e/find-next.spec.ts`.
- [x] 2.4 Create `e2e/find-previous.fixture.html` and refactor `e2e/find-previous.spec.ts`.
- [x] 2.5 Create `e2e/input.fixture.html` and refactor `e2e/input.spec.ts`.
- [x] 2.6 Create `e2e/show.fixture.html` and refactor `e2e/show.spec.ts`.
- [x] 2.7 Create `e2e/toggle-match-case.fixture.html` and refactor `e2e/toggle-match-case.spec.ts`.
- [x] 2.8 Create `e2e/toggle-match-whole-word.fixture.html` and refactor `e2e/toggle-match-whole-word.spec.ts`.
- [x] 2.9 Create `e2e/toggle-use-regular-expression.fixture.html` and refactor `e2e/toggle-use-regular-expression.spec.ts`.
- [x] 2.10 Remove `e2e/fixtures/` directory and its contents.

## 3. Verification

- [x] 3.1 Run `npm run test:e2e` to ensure all tests pass.
- [x] 3.2 Run `openspec validate refactor-e2e-fixtures --strict` to ensure spec compliance.
