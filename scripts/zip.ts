import { execSync } from "node:child_process";
import path from "node:path";
import { sync as rimrafSync } from "rimraf";

main();

function main() {
  const rootDir = process.cwd();
  const sourceDir = path.resolve(rootDir, "dist/v3");
  const targetZip = path.resolve(rootDir, "dist.zip");

  rimrafSync(targetZip);
  execSync(`tar -a -c -f "${targetZip}" -C "${sourceDir}" .`, {
    stdio: "inherit",
  });

  console.log("Finished.");
}
