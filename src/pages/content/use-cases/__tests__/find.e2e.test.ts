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
  const documentElement = createDocumentElement(
    `<div id="browser-find-top-layer">a</div>`,
  )
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}

// === element start ====
{
  const documentElement = createDocumentElement(`<script>"a"</script>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`<noscript>a</noscript>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`<style>a {}</style>`)
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(
    `<select><option>a</option></select>`,
  )
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
// === element end ====

// === class start ====
{
  const documentElement = createDocumentElement(
    `<span class="sr-only">a</span>`,
  )
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
// === class end ====

// === style start ====
{
  const documentElement = createDocumentElement(
    `<span style="display: none;">a</span>`,
  )
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(
    `<span style="visibility: hidden;">a</span>`,
  )
  suits.push({
    documentElement,
    text: 'a',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [],
  })
}
{
  {
    const documentElement = createDocumentElement(
      `<span style="text-transform: none;">a</span>`,
    )
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
    const documentElement = createDocumentElement(
      `<span style="text-transform: uppercase;">a</span>`,
    )
    suits.push({
      documentElement,
      text: 'A',
      shouldMatchCase: true,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            0,
            1,
          ),
        ],
      ],
    })
  }
  {
    const documentElement = createDocumentElement(
      `<span style="text-transform: lowercase;">A</span>`,
    )
    suits.push({
      documentElement,
      text: 'a',
      shouldMatchCase: true,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            0,
            1,
          ),
        ],
      ],
    })
  }
  {
    const documentElement = createDocumentElement(
      `<span style="text-transform: capitalize;">aBc aBc</span>`,
    )
    suits.push({
      documentElement,
      text: 'ABc',
      shouldMatchCase: true,
      shouldMatchWholeWord: false,
      shouldUseRegularExpression: false,
      expected: [
        [
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            0,
            1,
          ),
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            1,
            2,
          ),
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            2,
            3,
          ),
        ],
        [
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            4,
            5,
          ),
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            5,
            6,
          ),
          createRange(
            documentElement.querySelector('body')!.childNodes[0].childNodes[0],
            6,
            7,
          ),
        ],
      ],
    })
  }
}
// === style end ====

// === match case start ====
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
// === match case end ====

// === match whole word start ====
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
// === match whole word end ====

// === use regular expression start ====
{
  const documentElement = createDocumentElement(`\\d`)
  suits.push({
    documentElement,
    text: '\\d',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: false,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
      ],
    ],
  })
}
{
  const documentElement = createDocumentElement(`\\d`)
  suits.push({
    documentElement,
    text: '\\d',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: true,
    expected: [],
  })
}
{
  const documentElement = createDocumentElement(`\\d`)
  suits.push({
    documentElement,
    text: '\\\\d',
    shouldMatchCase: false,
    shouldMatchWholeWord: false,
    shouldUseRegularExpression: true,
    expected: [
      [
        createRange(documentElement.querySelector('body')!.childNodes[0], 0, 1),
        createRange(documentElement.querySelector('body')!.childNodes[0], 1, 2),
      ],
    ],
  })
}
// === use regular expression end ====

suits.forEach(
  ({
    documentElement,
    text,
    shouldMatchCase,
    shouldMatchWholeWord,
    shouldUseRegularExpression,
    expected,
  }) => {
    it(createTestName(), async () => {
      // arrange
      let onComplete = () => {}
      const promise = new Promise<void>((r) => (onComplete = r))
      const actual: Range[][] = []
      const onNext = (ranges: Range[]) => actual.push(ranges)

      // act
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

      // assert
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
    })

    function createTestName() {
      const booleanPadMaxLength = 5
      const textPadMaxLength = Math.max('text'.length, text.length) + 3
      const testName =
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
          ("'" + text + "'").padEnd(textPadMaxLength, ' '),
          "'" + documentElement.querySelector('body')!.innerHTML + "'",
        ].join('  ') +
        '\n   '
      return testName
    }
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
