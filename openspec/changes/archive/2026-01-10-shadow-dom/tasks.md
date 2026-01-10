## 1. Unit Tests (Red)

- [x] 1.1 Enable the shadow DOM suit in `src/pages/content/use-cases/__tests__/find.test.ts` and add a test case with an open shadow root.
- [x] 1.2 Run `npm run test:unit` to verify it fails.

## 2. Implementation (Green)

- [x] 2.1 Update `src/pages/content/use-cases/find.ts` to traverse `shadowRoot` of elements.
- [x] 2.2 Update `DFSStack` type to support `Node` (including `ShadowRoot`).
- [x] 2.3 Run `npm run test:unit` to verify it passes.

## 3. Refactor

- [x] 3.1 Review `createNodeMaps` for any potential optimizations or clarity improvements in the traversal logic.
- [x] 3.2 Ensure consistent handling of different node types (Element, Text, ShadowRoot, DocumentFragment).

## 4. E2E Verification

- [x] 4.1 Create `e2e/shadow-dom.fixture.html` with nested and various shadow DOM elements.
- [x] 4.2 Create `e2e/shadow-dom.spec.ts` to verify searching text within those shadow roots.
- [x] 4.3 Run `npm run test:e2e` to verify.
