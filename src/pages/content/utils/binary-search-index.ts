export const binarySearchIndex = <T, U>(
  array: T[],
  target: U,
  get: (value: T, index: number, obj: T[]) => U,
): number => {
  let first = 0
  let last = array.length - 1
  while (first <= last) {
    const mid = first + Math.floor((last - first) / 2)
    const midTarget = get(array[mid], mid, array)
    if (midTarget < target) {
      first = mid + 1
    } else if (target < midTarget) {
      last = mid - 1
    } else {
      return mid
    }
  }
  return -1
}
