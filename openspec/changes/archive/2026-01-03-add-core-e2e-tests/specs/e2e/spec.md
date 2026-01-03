# e2e Specification Delta

## MODIFIED Requirements

### Requirement: Playwright Framework Integration

The project MUST include Playwright for automated E2E testing. Tests MUST be independent, black-boxed, and use local HTML fixtures instead of external websites.

#### Scenario: Running E2E tests with local fixtures

- **Given** the extension is built.
- **And** a local HTML fixture exists in `e2e/fixtures/`.
- **When** I run the E2E tests.
- **Then** Playwright should load the local fixture using a `file://` path or local server.
- **And** the extension should be successfully injected into the page.
