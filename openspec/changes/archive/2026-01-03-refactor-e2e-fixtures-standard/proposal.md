# Change: Refactor E2E Fixtures to Standard Minimal HTML5

## Why

The current E2E fixtures lack standard HTML5 boilerplate (like `lang="en"` and `<meta charset="UTF-8">`) and contain unnecessary elements. Standardizing these fixtures ensures a consistent testing environment and follows best practices for modern web development.

## What Changes

- **MODIFIED** all `.fixture.html` files in the `e2e/` directory to follow a standard minimal HTML5 template.
- **REMOVED** redundant elements (like `<h1>` titles) from fixtures to keep them focused on test data.
- **ENSURED** each fixture contains only the minimal necessary content for its corresponding test suite.

## Impact

- Affected specs: `specs/e2e/spec.md`
- Affected code: `e2e/*.fixture.html`
