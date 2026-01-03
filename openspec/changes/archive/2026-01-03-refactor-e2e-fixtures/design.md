# Design: Co-located and Isolated E2E Fixtures

## Context

The current E2E fixtures are stored in a centralized `e2e/fixtures/` directory and shared across specs. To improve isolation and prevent side effects, we will move to a strategy where each spec has its own dedicated HTML fixture file.

## Decisions

### 1. Isolation Strategy: Dedicated Fixture Files

Each E2E spec file MUST use its own dedicated HTML fixture file.

- Fixture files will be co-located with the spec files in the `e2e/` directory.
- Naming convention: `[spec-name].fixture.html` (e.g., `close.fixture.html` for `close.spec.ts`).
- Shared global fixtures (like `simple.html`) will be removed in favor of these spec-specific files.

### 2. API Changes in `e2e/fixtures.ts`

- **`loadFixture(filename: string)`**: Updated to look for files in the `e2e/` root directory. Specs will call this with their specific fixture filename.
- **`setFixture(html: string)`**: (Discarded) We will strictly use HTML files as per requirements.

### 3. Migration

- For each `.spec.ts` file in `e2e/`:
  1. Create a corresponding `.fixture.html` file in `e2e/`.
  2. Copy/adapt the necessary HTML content from the current shared fixtures.
  3. Update the spec to load its dedicated fixture file.
- Example: `e2e/close.spec.ts` will load `e2e/close.fixture.html`.

## Risks / Trade-offs

- **Risk**: Increased number of files in the `e2e/` directory.
- **Mitigation**: The clear naming convention (`*.fixture.html`) keeps the relationship between tests and data explicit.
- **Benefit**: Changing a fixture for one test will never break another test.
