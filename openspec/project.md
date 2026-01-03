# Project Context

## Purpose

A browser extension designed specifically for Google Chrome that enables users to search for text within webpages using Regular Expressions (Regex). It aims to provide advanced find-on-page capabilities beyond standard browser search, supporting regex patterns, case sensitivity, and whole word matching. **Only Google Chrome is officially supported.**

## Tech Stack

- **Language:** TypeScript
- **Frontend Framework:** React 19
- **State Management:** Zustand (using Redux middleware pattern)
- **Styling:** Tailwind CSS (v4), PostCSS
- **Build Tools:** esbuild, tsx
- **Testing:** Jest, ts-jest, React Testing Library (implied by DOM deps)
- **Extension Utilities:** `webextension-polyfill`, `@floating-ui/dom`

## Project Conventions

### Code Style

- **Formatting:** Prettier is used for all code formatting.
- **Imports:** Organized automatically via `prettier-plugin-organize-imports`.
- **JSON:** Sorted via `prettier-plugin-sort-json` and `prettier-plugin-packagejson`.
- **Naming:** CamelCase for functions/vars, PascalCase for Components/Types.

### Architecture Patterns

- **State Management:** Strict Flux/Redux pattern implemented on top of Zustand.
  - **Actions:** Defined in `src/pages/content/action`.
  - **Reducers:** Pure functions in `src/pages/content/reducer` handling state transitions.
  - **Store:** Centralized in `src/pages/content/store` using `zustand/middleware/redux`.
- **Domain Logic:** Encapsulated in `src/pages/content/use-cases`.
- **UI:** React components located in `src/pages/content/components`.
- **Manifest:** Dynamic generation for both Manifest V2 and V3 (`src/manifest`).

### Testing Strategy

- **Unit Tests:** Jest is used for testing logic, reducers, and utilities.
- **Location:** `__tests__` directories co-located with the code (e.g., `src/use-cases/__tests__`, `src/utils/__tests__`).
- **Command:** `npm test` runs Jest in watch mode.

### Git Workflow

- **Commits:** Conventional Commits specification is strictly enforced.
- **Releases:** Automated via `release-please` (Google's release automation tool) based on commit messages.
- **CI/CD:** GitHub Workflows (`.github/workflows`) for CI and Release.

## Domain Context

- **Browser Extension:** Operates within the context of a web page (Content Script).
- **DOM Interaction:** extensively interacts with the DOM to highlight search results, scroll to matches, and manage focus.
- **Isolation:** Must ensure extension UI does not conflict with host page styles (likely uses Shadow DOM or specific CSS scoping/reset).

## Important Constraints

- **Browser Support:** Only Google Chrome is supported. Compatibility with other browsers (Firefox, Safari, Edge, etc.) is not a goal.
- **Manifest Versions:** Must support both Manifest V2 and V3.
- **Performance:** Regex searching on large DOMs can be expensive; performance optimization is critical.
- **Security:** Strict CSP requirements typical of browser extensions.

## External Dependencies

- **Chrome/WebExtension APIs:** Heavily relies on browser APIs (`chrome.runtime`, `chrome.tabs`, etc.) via `webextension-polyfill`.
