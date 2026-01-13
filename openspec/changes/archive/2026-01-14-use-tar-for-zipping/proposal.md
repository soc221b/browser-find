# Change: Use tar for scripts

## Why

The current `cross-zip` library is an external dependency that has shown potential issues on newer Node.js versions (22+) and adds maintenance overhead. Modern operating systems (Windows 10+, macOS, and Linux) all include a native `tar` utility that can handle ZIP creation reliably. Switching to `tar` simplifies the toolchain and reduces dependencies.

## What Changes

- Replace `cross-zip` usage in `scripts/zip.ts` with a native `tar` command executed via `child_process`.
- Remove `cross-zip` and `@types/cross-zip` from `package.json` devDependencies.
- Update build scripts to ensure they remain cross-platform using `tar`.

## Impact

- Affected specs: `specs/scripts/spec.md`
- Affected code: `scripts/zip.ts`, `package.json`
