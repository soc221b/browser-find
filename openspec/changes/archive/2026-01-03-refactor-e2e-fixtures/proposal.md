# Change: Refactor E2E Fixtures to Isolated File-based Strategy

## Why

The current E2E fixtures are stored in a centralized `e2e/fixtures/` directory and shared across multiple specs. This makes it difficult to modify a fixture without potentially breaking unrelated tests. Adopting an isolated strategy where each spec has its own dedicated HTML file will improve test maintainability and independence.

## What Changes

- **REMOVED** the centralized `e2e/fixtures/` directory.
- **ADDED** dedicated `.fixture.html` files for each spec in the `e2e/` directory (e.g., `close.fixture.html`).
- **MODIFIED** `e2e/fixtures.ts` to look for fixture files in the `e2e/` root.
- **MODIFIED** all E2E spec files to load their own unique fixture file.

## Impact

- Affected specs: `specs/e2e/spec.md`
- Affected code: `e2e/*.spec.ts`, `e2e/fixtures.ts`, `e2e/fixtures/*.html`
