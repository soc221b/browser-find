# Design: Core E2E Testing Strategy

## Overview

The end-to-end (E2E) testing strategy for Browser Find focuses on verifying user-facing features through the lens of a real browser (Chrome), while maintaining high reliability and isolation.

## Key Principles

1.  **Independent Tests:** Each test should start with a fresh browser state and not depend on the outcome of previous tests.
2.  **Black-Boxed:** Tests should interact with the extension via the UI (keyboard shortcuts, button clicks, input fields) rather than reaching into the internal state.
3.  **Local Fixtures:** Instead of navigating to live websites, tests will serve or directly load custom HTML files from a `e2e/fixtures` directory. This allows for precise control over the content and DOM structure being searched.

## Test Architecture

### 1. HTML Fixtures

A set of static HTML files will be created to represent different scenarios:

- `simple.html`: Basic text for standard search.
- `regex.html`: Content specifically designed to test complex regex patterns.
- `large.html`: A larger document to verify performance and scrolling.
- `shadow-dom.html`: (Future) To test searching inside Shadow DOM if supported.

### 2. Playwright Integration

- **Fixtures:** Enhance existing Playwright fixtures to support loading local files using `file://` or a local dev server.
- **Interactions:** Use `page.keyboard` for triggering shortcuts (e.g., `Meta+F`) and `page.locator` for interacting with the extension's UI components.
- **Assertions:** Verify that:
  - The find bar appears/disappears.
  - The correct number of matches is displayed.
  - Matches are highlighted in the DOM.
  - Navigation (Next/Prev) updates the active match.

## Core Scenarios to Cover

### Lifecycle

- Open find bar via hotkey.
- Close find bar via 'Esc' key.
- Close find bar via close button.

### Search Functionality

- Plain text search with results.
- Plain text search with no results.
- Regex search.
- Case-sensitive search.
- Whole word search.

### Navigation

- Cycle through matches using 'Enter' / 'Shift+Enter'.
- Cycle through matches using UI buttons.
- Result count updates correctly (e.g., "1 of 5").
