import { find } from '../find'

type Suit = {
  name: string

  documentElement: HTMLElement

  text: string

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  expected: Range[][]
}

const suits: Suit[] = []

suits.forEach((suit) => {
  it(suit.name, async () => {
    let resolve = () => {}
    const promise = new Promise<void>((r) => (resolve = r))
    const actual: Range[][] = []

    find({
      documentElement: suit.documentElement,
      text: suit.text,
      shouldMatchCase: suit.shouldMatchCase,
      shouldMatchWholeWord: suit.shouldMatchWholeWord,
      shouldUseRegularExpression: suit.shouldUseRegularExpression,
      onNext: ({ value, done }) => {
        actual.push(value)
        if (done) {
          resolve()
        }
      },
    })
    await promise

    expect(actual).toBe(suit.expected.length)

    actual.forEach((actualRanges, rangesListIndex) => {
      const expectedRanges = suit.expected[rangesListIndex]
      expect(actualRanges.length).toBe(expectedRanges.length)

      actualRanges.forEach((actualRange, rangesIndex) => {
        const expectedRange = expectedRanges[rangesIndex]
        expect(actualRange.startContainer).toBe(expectedRange.startContainer)
        expect(actualRange.startOffset).toBe(expectedRange.startOffset)
        expect(actualRange.endContainer).toBe(expectedRange.endContainer)
        expect(actualRange.endOffset).toBe(expectedRange.endOffset)
      })
    })
  })
})
