import { rimrafSync } from 'rimraf'
import { mkdirpSync } from 'mkdirp'
import sharp from 'sharp'

main()

function main() {
  removeAll()
  addAll()
}

function removeAll() {
  const publicDir = resolve(`../public`).replace(/\/index.jsx$/, '')

  rimrafSync(publicDir)
  mkdirpSync(publicDir)
}

function addAll() {
  const icon = 'logo'
  const sizes = [16, 32, 48, 128]

  for (const size of sizes) {
    sharp(resolve(`../src/assets/img/${icon}.svg`))
      .resize(size, size)
      .toFile(resolve(`../public/${icon}-${size}.png`))
  }
}

function resolve(specifier: string) {
  return import.meta.resolve(specifier).replace(/^file:\/\//, '')
}
