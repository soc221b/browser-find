import rimraf from 'rimraf'
import { mkdirp } from 'mkdirp'
import sharp from 'sharp'

const icons = ['logo', 'logo-dark']
const sizes = [16, 32, 48, 128]

await rimraf(
  (await import.meta.resolve?.(`../public`))!
    .replace(/^file:\/\//, '')
    .replace(/\/index.js$/, ''),
)
await mkdirp(
  (await import.meta.resolve?.(`../public`))!
    .replace(/^file:\/\//, '')
    .replace(/\/index.js$/, ''),
)
for (const icon of icons) {
  for (const size of sizes) {
    sharp(
      (await import.meta.resolve?.(`../src/assets/img/${icon}.svg`))!.replace(
        /^file:\/\//,
        '',
      ),
    )
      .resize(size, size)
      .toFile(
        (await import.meta.resolve?.(`../public/${icon}-${size}.png`))!.replace(
          /^file:\/\//,
          '',
        ),
      )
  }
}
