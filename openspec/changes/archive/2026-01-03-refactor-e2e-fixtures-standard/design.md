## Context

The E2E tests for Browser Find rely on HTML fixtures to provide a page for the extension to interact with. These fixtures should be minimal, standard-compliant, and focused on the specific feature being tested.

## Decisions

### Decision: Standard HTML5 Template

All E2E fixtures will use the following template:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Fixture: [Spec Name]</title>
  </head>
  <body>
    [Minimal Test Data]
  </body>
</html>
```

### Rationale:

- `<!DOCTYPE html>`: Ensures the browser is in standards mode.
- `lang="en"`: Standard accessibility practice.
- `<meta charset="UTF-8">`: Ensures proper character encoding.
- `<meta name="viewport">`: Simulates a modern mobile/desktop viewport environment.
- Title: Helps identify the fixture if viewed in a browser during debugging.

## Risks / Trade-offs

- **Risk:** Changing the content of fixtures might break existing tests if they rely on specific DOM structure or text that is removed.
- **Mitigation:** Carefully retain all strings and elements that are explicitly searched for or interacted with in the corresponding `.spec.ts` files.
