import { zipSync } from "cross-zip";
import { sync as rimrafSync } from "rimraf";

main();

function main() {
  rimrafSync("dist.zip");
  zipSync("dist/v3", "../dist.zip");

  console.log("Finished.");
}
