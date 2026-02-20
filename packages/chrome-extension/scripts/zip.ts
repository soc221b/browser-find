import { zipSync } from "cross-zip";
import fs from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { sync as rimrafSync } from "rimraf";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = resolve(__dirname, "..");

main();

function main() {
  const zipPath = resolve(rootDir, "dist.zip");
  const distPath = resolve(rootDir, "dist/v3");

  rimrafSync(zipPath);

  // Workaround for cross-zip bug on Windows/Node 24
  // cross-zip calls rmdirSync(outPath) which fails if outPath doesn't exist.
  if (process.platform === "win32" && !fs.existsSync(zipPath)) {
    fs.mkdirSync(zipPath, { recursive: true });
  }

  zipSync(distPath, zipPath);

  console.log("Finished.");
}
