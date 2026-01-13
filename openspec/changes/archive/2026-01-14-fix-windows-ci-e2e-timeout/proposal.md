# Change: Fix Windows CI E2E Timeout

## Why

The E2E tests are failing on Windows CI with timeouts. This is likely due to:

1.  Incorrect `file://` URL format on Windows when loading fixtures.
2.  Potential issues with extension loading or keyboard event handling on Windows.
3.  `userDataDir` path might be too deep or have permission issues on Windows CI.

By using `pathToFileURL` from the `url` module, we can ensure that local fixture files are loaded correctly across all platforms.

## What Changes

- Update `e2e/fixtures.ts` to use `pathToFileURL` for generating fixture URLs.
- Update `e2e/fixtures.ts` to ensure `userDataDir` is handled safely.
- Optionally increase the timeout for E2E tests on Windows if they are just slow.

## Impact

- Affected specs: `specs/e2e/spec.md`
- Affected code: `e2e/fixtures.ts`
