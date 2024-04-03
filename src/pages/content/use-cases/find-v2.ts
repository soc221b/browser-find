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

  CSS.highlights.delete('browser-find')
  CSS.highlights.delete('browser-find-match')

  if (text === '') {
    return cancel
  }

  const regex = createRegex({
    text,
    shouldMatchCase,
    shouldMatchWholeWord,
    shouldUseRegularExpression,
  })
  console.debug('[chrome-extension] [find] regex', regex)

  const nodeWithInnerTextList = createNodeWithInnerTextList({
    body: document.body,
  })
  console.debug(
    '[chrome-extension] [find] nodeWithInnerTextList',
    nodeWithInnerTextList,
  )

  const searchStringList = createSearchStringList({
    regex,
    innerText: document.body.innerText,
  })
  console.debug('[chrome-extension] [find] searchStringList', searchStringList)

  const rangesList = createRangesList({
    nodeWithInnerTextList: nodeWithInnerTextList,
    searchStringList,
    shouldMatchWholeWord,
  })
  console.debug('[chrome-extension] [find] rangesList', rangesList)

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
  try {
    let pattern = text
    pattern = shouldUseRegularExpression
      ? pattern
      : pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') // https://stackoverflow.com/a/9310752/7122623
    pattern = shouldMatchWholeWord ? `\\b${pattern}\\b` : `${pattern}`
    let flags = ''
    flags += 'g'
    flags += shouldMatchCase ? '' : 'i'
    return new RegExp(pattern, flags)
  } catch {
    return new RegExp('^\\b$')
  }
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

export function createNodeWithInnerTextList({
  body,
}: {
  body: HTMLElement
}): { node: Node; innerText: string }[] {
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
        innerText = innerText.trim() + ' '
      }

      nodeWithInnerTextList.push({
        node,
        innerText,
      })
    }
  }
  if (nodeWithInnerTextList.length) {
    nodeWithInnerTextList[nodeWithInnerTextList.length - 1].innerText =
      nodeWithInnerTextList[nodeWithInnerTextList.length - 1].innerText.slice(
        0,
        -1,
      )
  }
  return nodeWithInnerTextList
}

export function createRangesList({
  nodeWithInnerTextList,
  searchStringList,
  shouldMatchWholeWord,
}: {
  nodeWithInnerTextList: {
    node: Node
    innerText: string
  }[]
  searchStringList: string[]
  shouldMatchWholeWord: boolean
}): Range[][] {
  const rangesList: Range[][] = []

  const nodeWithInnerTextInfoList: {
    node: Node
    innerText: string
    innerTextFromStart: string
  }[] = nodeWithInnerTextList.reduce(
    (acc, { node, innerText }) => {
      return acc.concat({
        node,
        innerText,
        innerTextFromStart:
          (acc[acc.length - 1]?.innerTextFromStart ?? '') + innerText,
      })
    },
    [] as {
      node: Node
      innerText: string
      innerTextFromStart: string
    }[],
  )
  let usedIndexOfSearchStringList = 0
  /**
   * 儲存 abcd ef_g_ hi 的 abcd 的偏移量
   */
  let usedIndexOfNodeWithInnerTextInfoList = 0
  /**
   * 儲存已使用過的 a_bc_abc 的 c 的偏移量 3，下次從第二的 abc 開始找 bc
   */
  let endOffset = 0
  while (usedIndexOfSearchStringList < searchStringList.length) {
    const searchString = searchStringList[usedIndexOfSearchStringList]
    const ranges: Range[] = []

    /**
     * 儲存此次迴圈中 abcd ef_g_ hi 的 abcd 的偏移量
     */
    let walkingIndexOfNodeWithInnerTextInfoList =
      usedIndexOfNodeWithInnerTextInfoList
    level2: while (
      walkingIndexOfNodeWithInnerTextInfoList < nodeWithInnerTextInfoList.length
    ) {
      const walkingNodeWithInnerTextInfo =
        nodeWithInnerTextInfoList[walkingIndexOfNodeWithInnerTextInfoList]
      let indexOfInnerTextDespiteUsedAndEndOffset =
        walkingNodeWithInnerTextInfo.innerTextFromStart
          .slice(
            (nodeWithInnerTextInfoList[usedIndexOfNodeWithInnerTextInfoList - 1]
              ?.innerTextFromStart.length ?? 0) + endOffset,
          )
          .indexOf(searchString)
      const isMatched = 0 <= indexOfInnerTextDespiteUsedAndEndOffset
      if (isMatched) {
        let restOfSearchString = searchString
        let matchedIndexOfNodeWithInnerTextInfoList = (() => {
          let l = 0
          let r = walkingIndexOfNodeWithInnerTextInfoList
          while (l < r) {
            const m = l + Math.floor((r - l) / 2)
            if (
              0 <=
              walkingNodeWithInnerTextInfo.innerTextFromStart
                .slice(nodeWithInnerTextInfoList[m].innerTextFromStart.length)
                .indexOf(searchString)
            ) {
              l = m + 1
            } else {
              r = m - 1
            }
          }
          return l
        })()
        if (
          matchedIndexOfNodeWithInnerTextInfoList !==
          usedIndexOfNodeWithInnerTextInfoList
        ) {
          endOffset = 0
        }
        usedIndexOfNodeWithInnerTextInfoList =
          matchedIndexOfNodeWithInnerTextInfoList
        let startOffset =
          walkingNodeWithInnerTextInfo.innerTextFromStart
            .slice(
              (nodeWithInnerTextInfoList[
                matchedIndexOfNodeWithInnerTextInfoList - 1
              ]?.innerTextFromStart.length ?? 0) + endOffset,
            )
            .indexOf(searchString) + endOffset
        while (restOfSearchString.length) {
          const nodeWithInnerTextInfo =
            nodeWithInnerTextInfoList[matchedIndexOfNodeWithInnerTextInfoList]
          endOffset = Math.min(
            nodeWithInnerTextInfo.node.textContent!.length,
            nodeWithInnerTextInfo.innerText.length,
            startOffset + restOfSearchString.length,
          )
          restOfSearchString = restOfSearchString.slice(
            endOffset -
              startOffset +
              (/\s$/.test(nodeWithInnerTextInfo.innerText) ? 1 : 0),
          )
          if (shouldMatchWholeWord) {
            if (startOffset !== 0) {
              ++walkingIndexOfNodeWithInnerTextInfoList
              continue level2
            }
            if (
              restOfSearchString === '' &&
              endOffset !== nodeWithInnerTextInfo.innerText.length
            ) {
              ++walkingIndexOfNodeWithInnerTextInfoList
              continue level2
            }
          }
          const range = new Range()
          try {
            range.setStart(
              nodeWithInnerTextInfo.node,
              startOffset +
                (nodeWithInnerTextInfo.node.textContent!.match(/^\s+/)?.[0]
                  .length ?? 0),
            )
            range.setEnd(
              nodeWithInnerTextInfo.node,
              endOffset +
                (nodeWithInnerTextInfo.node.textContent!.match(/^\s+/)?.[0]
                  .length ?? 0),
            )
          } catch (e) {
            console.debug(
              '[chrome-extension] [find] invalid start/end offset',
              {
                searchStringList,
                usedIndexOfSearchStringList,
                nodeWithInnerTextInfoList,
                usedIndexOfNodeWithInnerTextInfoList,
                searchString,
                walkingIndexOfNodeWithInnerTextInfoList,
                matchedIndexOfNodeWithInnerTextInfoList,
                startOffset,
                endOffset,
                restOfSearchString,
              },
            )
            console.debug(e)
            return rangesList
          }
          ranges.push(range)
          startOffset = 0
          if (endOffset === nodeWithInnerTextInfo.innerText.length) {
            endOffset = 0
          }
          ++matchedIndexOfNodeWithInnerTextInfoList
        }
        break
      } else {
        ++walkingIndexOfNodeWithInnerTextInfoList
      }
    }

    if (ranges.length) {
      rangesList.push(ranges)
    } else {
      console.debug('[chrome-extension] [find] invalid state')
    }
    ++usedIndexOfSearchStringList
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
