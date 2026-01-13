import { mkdirpSync } from "mkdirp";
import { fileURLToPath } from "node:url";
import { rimrafSync } from "rimraf";
import sharp from "sharp";

main();

function main() {
  removeAll();
  addAll();
}

function removeAll() {
  const publicDir = resolve(`../public`).replace(/\/index.jsx$/, "");

  rimrafSync(publicDir);
  mkdirpSync(publicDir);
}

function addAll() {
  const icon = "logo";
  const sizes = [
    16,
    32,
    48,
    128,
  ];

  for (const size of sizes) {
    sharp(resolve(`../src/assets/img/${icon}.svg`))
      .resize(size, size)
      .toFile(resolve(`../public/${icon}-${size}.png`));
  }
}

function resolve(specifier: string) {
  return fileURLToPath(import.meta.resolve(specifier));
}
