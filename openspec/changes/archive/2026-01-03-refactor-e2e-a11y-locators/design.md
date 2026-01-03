# Design: Refactor E2E Tests to Use Accessibility Locators

## Architectural Reasoning

The current implementation uses `data-active` as a state flag for both styling and testing. While functional, it bypasses standard accessibility patterns. By switching to `aria-pressed`, we leverage the built-in semantics of HTML and ARIA.

### Component Changes

The following components will be updated:

- `ToggleMatchCase.tsx`
- `ToggleMatchWholeWord.tsx`
- `ToggleUseRegularExpression.tsx`

These components use a common pattern:

```tsx
<button className="icon" data-active={state} onClick={handler}>
  ...
</button>
```

Which will be changed to:

```tsx
<button className="icon" aria-pressed={state} onClick={handler}>
  ...
</button>
```

### CSS Changes

The `_StyleSheet.tsx` component contains the CSS for the extension. It uses `[data-active='true']` to style the active state of buttons. This will be updated to `[aria-pressed='true']`.

### Test Changes

In Playwright, instead of:

```typescript
await expect(toggle).toHaveAttribute("data-active", "true");
```

We will use:

```typescript
await expect(toggle).toHaveAttribute("aria-pressed", "true");
// Or even better
await expect(page.getByRole("button", { name: "Match Case", pressed: true })).toBeVisible();
```

## Trade-offs

- **Compatibility**: No impact on browser compatibility as `aria-pressed` is widely supported.
- **Complexity**: Minimal increase in code complexity, primarily just a naming change.
- **Migration**: Requires simultaneous updates to components, styles, and tests to avoid breaking the UI or CI.
