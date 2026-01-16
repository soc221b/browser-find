## 1. Refactor build-icons.ts

- [x] 1.1 Create a reproduction test case (or verify failure) for `file://` path replacement on Windows style paths (mental check or unit test if possible).
- [x] 1.2 Update `scripts/build-icons.ts` to use `fileURLToPath` from `node:url` instead of regex replacement.
- [x] 1.3 Verify the script runs successfully on the current environment.

## 2. Refactor zip.ts

- [x] 2.1 Update `scripts/zip.ts` to use `path.resolve` for `dist/v3` and `dist.zip` paths.
- [x] 2.2 Change output path from `../dist.zip` to `dist.zip` (root) if confirmed incorrect, or ensure it uses absolute paths. (Assumption: `dist.zip` in root).
- [x] 2.3 Verify `npm run build` generates `dist.zip` in the expected location.

## 3. Refactor build.ts

- [x] 3.1 Identify usage of `sleep` command in `scripts/build.ts`.
- [x] 3.2 Replace `sleep` command string with a Node.js based delay function or `setTimeout` loop, or use a cross-platform sleep package if available (prefer simple node logic).
- [x] 3.3 Verify `npm run build -- --dev` (which uses the watcher/sleep logic) works without error.
