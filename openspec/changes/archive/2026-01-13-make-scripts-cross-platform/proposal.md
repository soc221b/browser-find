# Change: Make Scripts Cross-Platform

## Why

Current development scripts contain platform-specific commands (like `sleep`) and fragile path handling (regex for `file://`) that cause failures on Windows environments. This hinders cross-platform development and CI.

## What Changes

- Refactor `scripts/build-icons.ts` to use `node:url`'s `fileURLToPath` for robust path parsing.
- Refactor `scripts/build.ts` to replace the shell-based `sleep` command with a Node.js implementation.
- Refactor `scripts/zip.ts` to use absolute paths and correct output location, ensuring compatibility across OSs.
- Establish a new `scripts` capability spec to enforce cross-platform compatibility.

## Impact

- **Affected Specs**: `scripts` (New capability)
- **Affected Code**: `scripts/build.ts`, `scripts/build-icons.ts`, `scripts/zip.ts`
- **Platform Support**: Enables Windows support for build and dev workflows.
