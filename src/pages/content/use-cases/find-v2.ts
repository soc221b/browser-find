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

  const nodeWithInnerTextList = createNodeWithInnerTextList({
    body: document.body,
  })

  const searchStringList = createSearchStringList({
    regex,
    innerText: document.body.innerText,
  })

  const rangesList = createRangesList({
    nodeWithInnerTextList: nodeWithInnerTextList,
    searchStringList,
    shouldMatchWholeWord,
  })

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
  /**
   * 儲存可使用的 searchStringList 偏移量
   * 假如:
   *  searchStringList = ["ab", "hi"]
   *  上次搜尋了 ab，則 startOffsetOfSearchStringList 會是 1
   */
  let startOffsetOfSearchStringList = 0
  /**
   * 儲存可使用的 nodeWithInnerTextInfoList 偏移量
   * 假如:
   *  searchStringList = ["abc", "hi"]
   *  nodeWithInnerTextInfoList = ["abcd", "efg", "hi"]
   *  startOffsetOfSearchStringList = 1
   *  因為上次搜尋過的 abc，而 d 還不確定是否會被匹配
   *  nearestPossibleStartOffsetOfNodeWithInnerTextInfoList 會是 0
   */
  let nearestPossibleStartOffsetOfNodeWithInnerTextInfoList = 0
  /**
   * 儲存可使用的 nodeWithInnerTextInfoList[number].innerText 偏移量
   * 假如:
   *  searchStringList = ["abc", "hi"]
   *  nodeWithInnerTextInfoList = ["abcd", "efg", "hi"]
   *  startOffsetOfSearchStringList = 1
   *  因為上次搜尋過的 abc，而 d 還不確定是否會被匹配
   *  endOffset 會是 3
   */
  let endOffset = 0
  while (startOffsetOfSearchStringList < searchStringList.length) {
    const searchString = searchStringList[startOffsetOfSearchStringList]
    const ranges: Range[] = []

    /**
     * 儲存匹配時的最後一個 nodeWithInnerTextInfoList 偏移量
     * 假如:
     *  searchStringList = ["abcdef"]
     *  nodeWithInnerTextInfoList = ["abcd", "efg", "hi"]
     *  startOffsetOfSearchStringList = 0
     *  lastOffsetOfNodeWithInnerTextInfoList 會是 1
     */
    let lastOffsetOfNodeWithInnerTextInfoList =
      nearestPossibleStartOffsetOfNodeWithInnerTextInfoList
    level2: while (
      lastOffsetOfNodeWithInnerTextInfoList < nodeWithInnerTextInfoList.length
    ) {
      const lastNodeWithInnerTextInfo =
        nodeWithInnerTextInfoList[lastOffsetOfNodeWithInnerTextInfoList]
      const isMatched =
        0 <=
        lastNodeWithInnerTextInfo.innerTextFromStart
          .slice(
            (nodeWithInnerTextInfoList[
              nearestPossibleStartOffsetOfNodeWithInnerTextInfoList - 1
            ]?.innerTextFromStart.length ?? 0) + endOffset,
          )
          .indexOf(searchString)
      if (isMatched) {
        let restOfSearchString = searchString
        /**
         * 儲存確認匹配時的正確 nodeWithInnerTextInfoList 開始偏移量
         * 假如:
         *  searchStringList = ["abc", "fghi"]
         *  startOffsetOfSearchStringList = 1
         *  nodeWithInnerTextInfoList = ["abcd", "efg", "hi"]
         *  迴圈會從 nearestPossibleStartOffsetOfNodeWithInnerTextInfoList 0 開始找
         *  但實際是從 efg 這個 node 開始匹配的
         *  此時 startOffsetOfNodeWithInnerTextInfoList 會是 1
         */
        let startOffsetOfNodeWithInnerTextInfoList = (() => {
          let l = 0
          let r = lastOffsetOfNodeWithInnerTextInfoList
          while (l < r) {
            const m = l + Math.floor((r - l) / 2)
            if (
              0 <=
              lastNodeWithInnerTextInfo.innerTextFromStart
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
          startOffsetOfNodeWithInnerTextInfoList !==
          nearestPossibleStartOffsetOfNodeWithInnerTextInfoList
        ) {
          endOffset = 0
        }
        nearestPossibleStartOffsetOfNodeWithInnerTextInfoList =
          startOffsetOfNodeWithInnerTextInfoList
        let startOffset =
          lastNodeWithInnerTextInfo.innerTextFromStart
            .slice(
              (nodeWithInnerTextInfoList[
                startOffsetOfNodeWithInnerTextInfoList - 1
              ]?.innerTextFromStart.length ?? 0) + endOffset,
            )
            .indexOf(searchString) + endOffset
        while (restOfSearchString.length) {
          const nodeWithInnerTextInfo =
            nodeWithInnerTextInfoList[startOffsetOfNodeWithInnerTextInfoList]
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
              ++lastOffsetOfNodeWithInnerTextInfoList
              continue level2
            }
            if (
              restOfSearchString === '' &&
              endOffset !== nodeWithInnerTextInfo.innerText.length
            ) {
              ++lastOffsetOfNodeWithInnerTextInfoList
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
                startOffsetOfSearchStringList,
                nodeWithInnerTextInfoList,
                nearestPossibleStartOffsetOfNodeWithInnerTextInfoList,
                searchString,
                lastOffsetOfNodeWithInnerTextInfoList,
                startOffsetOfNodeWithInnerTextInfoList,
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
          ++startOffsetOfNodeWithInnerTextInfoList
        }
        break
      } else {
        ++lastOffsetOfNodeWithInnerTextInfoList
      }
    }

    if (ranges.length) {
      rangesList.push(ranges)
    } else {
      console.debug('[chrome-extension] [find] invalid state')
    }
    ++startOffsetOfSearchStringList
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
