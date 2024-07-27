import { binarySearchIndex } from '../binary-search-index'

it('should return -1 if not found', () => {
  expect(binarySearchIndex([], null, (value) => value)).toBe(-1)
})

it('should return correct index (1)', () => {
  const array = Array(1)
    .fill(null)
    .map(() => Math.random())
    .sort((a, b) => a - b)

  for (const value of array) {
    const expected = array.findIndex((v) => v === value)
    const actual = binarySearchIndex(array, value, (value) => value)
    expect(actual).toBe(expected)
  }
})

it('should return correct index (2)', () => {
  const array = Array(1)
    .fill(null)
    .map(() => Math.random())
    .sort((a, b) => a - b)

  for (const value of array) {
    const expected = array.findIndex((v) => v === value)
    const actual = binarySearchIndex(array, value, (value) => value)
    expect(actual).toBe(expected)
  }
})

it('should return correct index (odd)', () => {
  const array = Array(101)
    .fill(null)
    .map(() => Math.random())
    .sort((a, b) => a - b)

  for (const value of array) {
    const expected = array.findIndex((v) => v === value)
    const actual = binarySearchIndex(array, value, (value) => value)
    expect(actual).toBe(expected)
  }
})

it('should return correct index (even)', () => {
  const array = Array(100)
    .fill(null)
    .map(() => Math.random())
    .sort((a, b) => a - b)

  for (const value of array) {
    const expected = array.findIndex((v) => v === value)
    const actual = binarySearchIndex(array, value, (value) => value)
    expect(actual).toBe(expected)
  }
})

it('should be O(logN)', () => {
  const array = Array(100)
    .fill(null)
    .map((_, i) => i)
  const expected = Math.ceil(Math.log2(array.length))

  for (const value of array) {
    const get = jest.fn(<T>(value: T): T => value)
    binarySearchIndex(array, value, get)
    expect(get.mock.calls.length).toBeLessThanOrEqual(expected)
  }
})
