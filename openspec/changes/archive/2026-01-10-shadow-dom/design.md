# Design: Shadow DOM Traversal for Find Operation

## Context

The `find` use case uses a Depth-First Search (DFS) stack to iterate through all elements and text nodes in the document to build a continuous "inner text-like" map of the page. This map is then used to perform regex matching.

Currently, the DFS stack only pushes `childNodes` of elements. Shadow DOM roots are not part of `childNodes`.

## Goals

- Enable text search within open Shadow Roots.
- Maintain existing performance by continuing to use iterative DFS.
- Support nested Shadow DOMs.

## Decisions

### 1. Update DFS Traversal in `createNodeMaps`

In `src/pages/content/use-cases/find.ts`, the `createNodeMaps` function's loop will be updated to check for `shadowRoot` on every element node.

**Logic:**
When visiting an `ELEMENT_NODE`:

1. Check if it has a `shadowRoot`.
2. If `element.shadowRoot` exists, push it onto the `DFSStack`.
3. Continue pushing its regular `childNodes` as before.

Wait, if I push `shadowRoot`, I should probably push it _after_ or _before_ child nodes depending on how we want it to appear in the text stream. Usually, shadow content is rendered "instead of" or "alongside" light DOM content. However, for a "Find" operation, we generally want to search everything that is visible.

Actually, the stack-based DFS currently works like this:

```typescript
    const childNode = childNodes[childNodeIndex];
    switch (childNode.nodeType) {
      case Node.ELEMENT_NODE: {
        // ...
        DFSStack.push({
          parentElement: element,
          nextChildNodeIndex: 0,
        });
        break;
      }
```

If I add `shadowRoot` support:

```typescript
      case Node.ELEMENT_NODE: {
        const element = childNode as Element;
        // ...
        if (element.shadowRoot) {
           DFSStack.push({
             parentElement: element.shadowRoot,
             nextChildNodeIndex: 0,
           });
        }
        DFSStack.push({
          parentElement: element,
          nextChildNodeIndex: 0,
        });
        break;
      }
```

Wait, if I push both, I might visit them in a specific order.
Actually, `element.shadowRoot` is a `DocumentFragment`. Its children are what we want to visit.

If an element has both Light DOM (`childNodes`) and Shadow DOM, which one should we search? Usually, if it has a Shadow DOM, the Light DOM might not be rendered unless there are slots.

However, to be comprehensive and follow how `find` usually works in browsers, we should probably search both if we are building a flat text representation.

Revised logic for `ELEMENT_NODE`:

1. If `element.shadowRoot` exists:
   - Push it onto the stack so its children are processed.
2. Push the element itself (for its `childNodes`).

Actually, I should be careful about the order to ensure it matches visual flow as much as possible, though "visual flow" with Shadow DOM and Slots is complex. For now, entering the Shadow Root is the priority.

### 2. Handling `DocumentFragment` (ShadowRoot)

The `DFSStack` current expects `parentElement: null | ChildNode`. `ShadowRoot` inherits from `DocumentFragment`, which is not a `ChildNode` (it doesn't have a `parentElement`).

The stack items look like:

```typescript
let DFSStack: {
  parentElement: null | ChildNode;
  nextChildNodeIndex: number;
}[] = [
  {
    parentElement: documentElement,
    nextChildNodeIndex: 0,
  },
];
```

I should update the type to allow `Node` or specifically `DocumentFragment`/`ShadowRoot`.

## Risks / Trade-offs

- **Performance:** Entering shadow roots adds more nodes to traverse. Since it's still iterative and uses `requestAnimationFrame` (via `sleep("raf")`), it should remain responsive.
- **Closed Shadow Roots:** `element.shadowRoot` only returns the root if it's "open". Closed shadow roots are inaccessible by design and will remain unsearchable.
