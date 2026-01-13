## 1. Preparation

- [x] 1.1 Remove `cross-zip` and `@types/cross-zip` from `devDependencies` in `package.json`
- [x] 1.2 Run `npm install` to update `package-lock.json`

## 2. Implementation

- [x] 2.1 Update `scripts/zip.ts` to use `child_process.execSync` with the `tar` command
- [x] 2.2 Verify ZIP creation on the current platform by running `npm run build`
- [x] 2.3 Verify the contents of the generated `dist.zip`
