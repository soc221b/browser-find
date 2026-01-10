# Change: shadow-dom

## Why

The current find operation only traverses the main DOM and iframes, completely missing text content residing within Shadow DOMs. This results in users being unable to find and highlight matches in modern web components (e.g., GitHub's `<relative-time>`) and other shadow-root isolated elements.

## What Changes

- **Core Search Logic:** Update the DOM traversal algorithm to recursively enter and search within open Shadow Roots.
- **Unit Tests:** Add comprehensive test cases to `src/pages/content/use-cases/__tests__/find.test.ts` verifying shadow DOM traversal.
- **E2E Tests:** Add a new Playwright fixture and test spec to verify real-world shadow DOM search functionality.

## Impact

- Affected specs: `shadow-dom` (New capability)
- Affected code: `src/pages/content/use-cases/find.ts`
