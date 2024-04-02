type Find = (_: {
  text: string

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  onMatch: (match: { id: string; scrollIntoView: () => void }) => void
}) => Cancel

type Cancel = () => void

const find: Find = ({
  text,
  shouldMatchCase,
  shouldMatchWholeWord,
  shouldUseRegularExpression,
  onMatch,
}) => {
  let isCancelled = false
  const cancel = () => {
    isCancelled = true
  }

  console.log('====')
  const regex = createRegex({
    text,
    shouldMatchCase,
    shouldMatchWholeWord,
    shouldUseRegularExpression,
  })
  console.log('regex', regex)

  const nodeWithInnerTextList = createNodeWithInnerTextList({
    body: document.body,
  })
  console.log('nodeWithInnerTextList', nodeWithInnerTextList)

  const searchStringList = createSearchStringList({
    regex,
    innerText: document.body.innerText,
  })
  console.log('searchStringList', searchStringList)

  const rangesList = createRangesList({
    nodeWithInnerTextList: nodeWithInnerTextList,
    searchStringList,
  })
  console.log('rangesList', rangesList)

  match({
    rangesList,
    onMatch,
  })

  return cancel
}

export default find

export function createRegex({
  text,
  shouldMatchCase,
  shouldMatchWholeWord,
  shouldUseRegularExpression,
}: {
  text: string
  shouldMatchCase: boolean
  shouldMatchWholeWord: boolean
  shouldUseRegularExpression: boolean
}): RegExp {
  let pattern = text
  pattern = shouldUseRegularExpression
    ? pattern
    : pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') // https://stackoverflow.com/a/9310752/7122623
  pattern = shouldMatchWholeWord ? `\\b${pattern}\\b` : `${pattern}`
  let flags = ''
  flags += 'g'
  flags += shouldMatchCase ? '' : 'i'
  return new RegExp(pattern, flags)
}

export function createSearchStringList({
  regex,
  innerText,
}: {
  regex: RegExp
  innerText: string
}): string[] {
  const searchStringList: string[] = []
  let array: null | RegExpExecArray
  while ((array = regex.exec(innerText)) !== null) {
    searchStringList.push(array[0])
  }
  return searchStringList
}

export function createNodeWithInnerTextList({ body }: { body: HTMLElement }) {
  const treeWalker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT)
  let node
  let nodeWithInnerTextList: { node: Node; innerText: string }[] = []
  while ((node = treeWalker.nextNode()) !== null) {
    let parentElement = node.parentElement
    while (parentElement !== null) {
      if (parentElement.tagName === 'NOSCRIPT') {
        break
      }

      const computedStyle = getComputedStyle(parentElement)
      if (computedStyle.display === 'none') {
        break
      }
      if (computedStyle.visibility === 'hidden') {
        break
      }

      parentElement = parentElement.parentElement
    }
    if (
      parentElement === null &&
      node.textContent !== null &&
      node.textContent.trim()
    ) {
      let innerText = node.textContent
      if (node.parentElement instanceof Element) {
        const parentComputedStyle = getComputedStyle(node.parentElement)
        if (parentComputedStyle.textTransform === 'uppercase') {
          innerText = innerText.toUpperCase()
        }
        if (parentComputedStyle.textTransform === 'lowercase') {
          innerText = innerText.toLowerCase()
        }
        if (parentComputedStyle.textTransform === 'lowercase') {
          innerText = innerText.toLowerCase()
        }
      }

      nodeWithInnerTextList.push({
        node,
        innerText,
      })
    }
  }
  return nodeWithInnerTextList
}

export function createRangesList({
  nodeWithInnerTextList,
  searchStringList,
}: {
  nodeWithInnerTextList: {
    node: Node
    innerText: string
  }[]
  searchStringList: string[]
}): Range[][] {
  const rangesList: Range[][] = []

  let index = 0
  searchStringList.forEach((searchString) => {
    const ranges: Range[] = []

    return ranges
  })

  const range = new Range()
  if (searchStringList.includes('Do not share my personal information')) {
    const tempNodeWithInnerText =
      nodeWithInnerTextList[nodeWithInnerTextList.length - 2]
    console.log('123', tempNodeWithInnerText)
    range.setStart(tempNodeWithInnerText.node, 0)
    range.setEnd(
      tempNodeWithInnerText.node,
      tempNodeWithInnerText.node.textContent!.length,
    )
    rangesList.push([range])
  }

  return rangesList
}

function match({
  rangesList,
  onMatch,
}: {
  rangesList: Range[][]
  onMatch: (match: { id: string; scrollIntoView: () => void }) => void
}) {
  rangesList.forEach((ranges, index) => {
    onMatch({
      id: index.toString(),
      scrollIntoView: () => {
        CSS.highlights.set(
          'browser-find',
          new Highlight(
            ...rangesList.slice(0, index).flat(),
            ...rangesList.slice(index + 1).flat(),
          ),
        )
        CSS.highlights.set('browser-find-match', new Highlight(...ranges))
        ranges[0].startContainer.parentElement?.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
          inline: 'nearest',
        })
      },
    })
  })
}
