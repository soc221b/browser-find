# Change: Move Playwright User Data Directory

## Why

The current location of `userDataDir` (`.playwright-user-data-${workerInfo.workerIndex}`) in the project root can cause issues in environments with restricted file access (like macOS Seatbelt) or clutter the project root. Moving it to `node_modules/.playwright` ensures it is ignored by version control and resides in a directory typically allowed for read/write operations.

## What Changes

- Update `e2e/fixtures.ts` to use `node_modules/.playwright/user-data-${workerInfo.workerIndex}` as the `userDataDir`.
- Update `.gitignore` to reflect the change and ensure any remaining old directories are properly ignored.

## Impact

- Affected specs: `specs/e2e/spec.md`
- Affected code: `e2e/fixtures.ts`, `.gitignore`
