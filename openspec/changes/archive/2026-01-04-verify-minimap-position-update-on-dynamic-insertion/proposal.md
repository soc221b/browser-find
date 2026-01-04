# Change: Verify Minimap Position Update on Dynamic Insertion

## Why

Currently, while we have basic tests for dynamic content addition (checking if new matches appear), we don't explicitly verify that the _positions_ of existing matches in the minimap are updated correctly when content is inserted _above_ or _between_ them. This ensures that the minimap remains accurate as the document height and layout change dynamically.

## What Changes

- Add a new E2E test fixture `e2e/minimap-insert.fixture.html` that allows inserting content between matches.
- Add a new E2E test in `e2e/minimap.spec.ts` that verifies the position of a match tick changes when content is inserted before it.

## Impact

- Affected specs: `minimap` (End-to-end test coverage)
- Affected code: `e2e/minimap.spec.ts`, `e2e/minimap-insert.fixture.html` (new)
