import { sync as rimrafSync } from 'rimraf'
import { zipSync } from 'cross-zip'

function build() {
  rimrafSync('dist.zip')
  zipSync('dist/v3', 'dist.zip')

  console.log('Finished.')
}

build()
