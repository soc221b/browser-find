import { find } from '../find'

type Suit = {
  documentElement: HTMLElement

  text: string

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  expected: Range[][]
}

const suits: Suit[] = []

{
  const documentElement = createDocumentElement(`a`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1)],
    ],
  })
}

{
  const documentElement = createDocumentElement(`a`)
  suits.push({
    documentElement,
    text: 'A',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1)],
    ],
  })
}
{
  const documentElement = createDocumentElement(`a`)
  suits.push({
    documentElement,
    text: 'A',
    shouldMatchCase: true,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`A`)
  suits.push({
    documentElement,
    text: 'A',
    shouldMatchCase: true,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1)],
    ],
  })
}

{
  const documentElement = createDocumentElement(`abc`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1)],
    ],
  })
}
{
  const documentElement = createDocumentElement(`abc`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: true,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`abc`)
  suits.push({
    documentElement,
    text: 'abc',
    shouldMatchCase: false,
    shouldMatchWholeWord: true,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
        createRange(documentElement.querySelector('body')!.childNodes[0], 2, 3),
      ],
    ],
  })
}

suits.forEach(
  ({
    documentElement,
    text,
    shouldMatchCase,
    shouldMatchWholeWord,
    shouldUseRegularExpression,
    expected,
  }) => {
    const booleanPadMaxLength = 5
    const textPadMaxLength = Math.max('text'.length, text.length) + 3
    it(
      [
        'C'.padEnd(booleanPadMaxLength, ' '),
        'W'.padEnd(booleanPadMaxLength, ' '),
        'R'.padEnd(booleanPadMaxLength, ' '),
        'text'.padEnd(textPadMaxLength, ' '),
        'innerHTML',
      ].join('  ') +
        '\n    ' +
        [
          String(shouldMatchCase).padEnd(booleanPadMaxLength, ' '),
          String(shouldMatchWholeWord).padEnd(booleanPadMaxLength, ' '),
          String(shouldUseRegularExpression).padEnd(booleanPadMaxLength, ' '),
          JSON.stringify(text).padEnd(textPadMaxLength, ' '),
          JSON.stringify(documentElement.querySelector('body')!.innerHTML),
        ].join('  ') +
        '\n   ',
      async () => {
        let onComplete = () => {}
        const promise = new Promise<void>((r) => (onComplete = r))

        const actual: Range[][] = []
        const onNext = (ranges: Range[]) => actual.push(ranges)

        find({
          documentElement,
          text,
          shouldMatchCase,
          shouldMatchWholeWord,
          shouldUseRegularExpression,
          onNext,
          onComplete,
        })
        await promise

        try {
          expect(actual.length).toBe(expected.length)

          actual.forEach((actualRanges, rangesListIndex) => {
            const expectedRanges = expected[rangesListIndex]
            expect(actualRanges.length).toBe(expectedRanges.length)

            actualRanges.forEach((actualRange, rangesIndex) => {
              const expectedRange = expectedRanges[rangesIndex]
              expect(actualRange.startContainer).toBe(
                expectedRange.startContainer,
              )
              expect(actualRange.startOffset).toBe(expectedRange.startOffset)
              expect(actualRange.endContainer).toBe(expectedRange.endContainer)
              expect(actualRange.endOffset).toBe(expectedRange.endOffset)
            })
          })
        } catch (e) {
          throw e
        }
      },
    )
  },
)

function createDocumentElement(bodyInnerHTML: string): HTMLElement {
  const body = document.createElement('body')
  body.innerHTML = bodyInnerHTML
  const documentElement = document.createElement('html')
  documentElement.appendChild(body)
  return documentElement
}

function createRange(
  node: Node,
  startOffset: number,
  endOffset: number,
): Range {
  const range = new Range()
  range.setStart(node, startOffset)
  range.setEnd(node, endOffset)
  return range
}
