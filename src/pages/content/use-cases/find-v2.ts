import sleep from '../utils/sleep'

type Find = (_: {
  text: string

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  onMatch: (match: { id: string; scrollIntoView: () => void }) => void
}) => Cancel

type Cancel = () => void

const DEBUG = false

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

  ;(async () => {
    if (DEBUG) {
      console.time('[chrome-extension][find][regex]')
    }
    const regex = createRegex({
      text,
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
    })
    if (DEBUG) {
      console.timeEnd('[chrome-extension][find][regex]')
      console.debug('[chrome-extension][find][regex]', regex)
    }

    if (DEBUG) {
      console.time('[chrome-extension][find][searchStringList]')
    }
    const searchStringList = createSearchStringList({
      regex,
      innerText: document.body.innerText,
    })
    if (DEBUG) {
      console.timeEnd('[chrome-extension][find][searchStringList]')
      console.debug(
        '[chrome-extension][find][searchStringList]',
        searchStringList,
      )
    }

    if (DEBUG) {
      console.time('[chrome-extension][find][nodeWithInnerTextList]')
    }
    const nodeWithInnerTextList = await createNodeWithInnerTextList({
      documentElement: document.documentElement,
    })
    if (DEBUG) {
      console.timeEnd('[chrome-extension][find][nodeWithInnerTextList]')
      console.debug(
        '[chrome-extension][find][nodeWithInnerTextList]',
        nodeWithInnerTextList,
      )
    }
    await sleep('raf')
    if (isCancelled) {
      return
    }

    if (DEBUG) {
      console.time('[chrome-extension][find][rangesList]')
    }
    const rangesList = await createRangesList({
      nodeWithInnerTextList,
      searchStringList,
      shouldMatchWholeWord,
    })
    if (DEBUG) {
      console.timeEnd('[chrome-extension][find][rangesList]')
      console.debug('[chrome-extension][find][rangesList]', rangesList)
    }
    await sleep('raf')
    if (isCancelled) {
      return
    }

    match({
      rangesList,
      onMatch,
    })
  })()

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
    flags += 'gm'
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
  return Array.from(innerText.matchAll(regex))
    .map((array) => array[0])
    .filter(Boolean)
}

export async function createNodeWithInnerTextList({
  documentElement,
}: {
  documentElement: HTMLElement
}): Promise<{ node: Node; innerText: string }[]> {
  let nodeWithInnerTextList: { node: Node; innerText: string }[] = []
  let stack: {
    childNode: null | ChildNode
    childNodeIndex: number
  }[] = [
    {
      childNode: documentElement,
      childNodeIndex: 0,
    },
  ]
  let i = 0
  while (stack.length) {
    if (++i % 5_000 === 0) {
      await sleep('raf')
    }
    const top = stack[stack.length - 1]
    if (top.childNode === null) {
      stack.pop()
      continue
    }

    const childNodes = top.childNode.childNodes
    const childIndex = top.childNodeIndex
    if (childNodes.length <= childIndex) {
      stack.pop()
      continue
    }

    const childNode = childNodes[childIndex]
    switchLabel: switch (childNode.nodeType) {
      case Node.ELEMENT_NODE: {
        const elementNode = childNode as Element
        const ignoredTagNames = ['SCRIPT', 'NOSCRIPT', 'STYLE', 'SELECT']
        if (ignoredTagNames.includes(elementNode.tagName)) {
          break
        }

        if (elementNode.classList.contains('sr-only')) {
          break
        }

        // FIXME: performance
        const CSSStyleDeclaration = getComputedStyle(elementNode)
        if (CSSStyleDeclaration.display === 'none') {
          break switchLabel
        }
        if (CSSStyleDeclaration.visibility === 'hidden') {
          break switchLabel
        }

        stack.push({
          childNode: elementNode,
          childNodeIndex: 0,
        })
        break
      }
      case Node.TEXT_NODE: {
        if (childNode.textContent && childNode.textContent.trim()) {
          let innerText = childNode.textContent
          const parentElement = childNode.parentElement
          if (parentElement) {
            const CSSStyleDeclarationOfParentElement =
              getComputedStyle(parentElement)
            if (
              CSSStyleDeclarationOfParentElement.textTransform === 'uppercase'
            ) {
              innerText = innerText.toUpperCase()
            }
            if (
              CSSStyleDeclarationOfParentElement.textTransform === 'lowercase'
            ) {
              innerText = innerText.toLowerCase()
            }
            if (parentElement.childNodes[0] === childNode) {
              innerText = innerText.replace(/^\s+/, '')
            } else {
              if (
                childNode.previousSibling instanceof Element &&
                childNode.previousSibling.tagName === 'BR'
              ) {
                innerText = innerText.trimStart()
              }
            }
            if (
              parentElement.childNodes[parentElement.childNodes.length - 1] ===
              childNode
            ) {
              innerText = innerText.replace(/\s+$/, '')
            } else {
              if (/\s+$/.test(innerText)) {
                innerText = innerText.trimEnd() + ' '
              }
            }
            if (parentElement.tagName === 'OPTION') {
              const parentParentElement = parentElement.parentElement
              if (parentParentElement) {
                if (parentParentElement.tagName === 'SELECT') {
                  if (parentParentElement.childNodes[0] !== parentElement) {
                    nodeWithInnerTextList.push({
                      node: documentElement.ownerDocument.createTextNode(''),
                      innerText: '\n',
                    })
                  }
                }
              }
            }
          }
          nodeWithInnerTextList.push({
            node: childNode,
            innerText,
          })
        } else {
          nodeWithInnerTextList.push({
            node: childNode,
            innerText: ' ',
          })
        }
        break
      }
    }

    ++top.childNodeIndex
  }

  return nodeWithInnerTextList
}

export async function createRangesList({
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
}): Promise<Range[][]> {
  const rangesList: Range[][] = []

  let allInnerText = ''
  const nodeWithInnerTextInfoList: {
    node: Node
    innerText: string
    lastOffsetOfAllInnerText: number
  }[] = nodeWithInnerTextList.reduce(
    (acc, { node, innerText }) => {
      allInnerText += innerText
      return acc.concat({
        node,
        innerText,
        lastOffsetOfAllInnerText:
          (acc[acc.length - 1]?.lastOffsetOfAllInnerText ?? 0) +
          innerText.length,
      })
    },
    [] as {
      node: Node
      innerText: string
      lastOffsetOfAllInnerText: number
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
  let i = 0
  while (startOffsetOfSearchStringList < searchStringList.length) {
    if (++i % 100 === 0) {
      await sleep('raf')
    }

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
        allInnerText
          .slice(
            (nodeWithInnerTextInfoList[
              nearestPossibleStartOffsetOfNodeWithInnerTextInfoList - 1
            ]?.lastOffsetOfAllInnerText ?? 0) + endOffset,
            lastNodeWithInnerTextInfo.lastOffsetOfAllInnerText,
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
          let l = nearestPossibleStartOffsetOfNodeWithInnerTextInfoList
          let r = lastOffsetOfNodeWithInnerTextInfoList
          while (l < r) {
            const m = l + Math.floor((r - l) / 2)
            if (
              0 <=
              allInnerText
                .slice(
                  nodeWithInnerTextInfoList[m].lastOffsetOfAllInnerText,
                  lastNodeWithInnerTextInfo.lastOffsetOfAllInnerText,
                )
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
          allInnerText
            .slice(
              (nodeWithInnerTextInfoList[
                startOffsetOfNodeWithInnerTextInfoList - 1
              ]?.lastOffsetOfAllInnerText ?? 0) + endOffset,
              lastNodeWithInnerTextInfo.lastOffsetOfAllInnerText,
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
          restOfSearchString = restOfSearchString.slice(endOffset - startOffset)
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
            const startSpaceOffset =
              nodeWithInnerTextInfo.node.textContent?.indexOf(
                nodeWithInnerTextInfo.innerText,
              ) ?? 0
            startOffset += startSpaceOffset
            endOffset += startSpaceOffset
            range.setStart(nodeWithInnerTextInfo.node, startOffset)
            range.setEnd(nodeWithInnerTextInfo.node, endOffset)
          } catch (e) {
            if (DEBUG) {
              console.debug(
                '[chrome-extension][find][rangesList] invalid start/end offset',
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
            }
            return rangesList
          }
          ranges.push(range)
          startOffset = 0
          ++startOffsetOfNodeWithInnerTextInfoList
          if (endOffset === nodeWithInnerTextInfo.innerText.length) {
            endOffset = 0
            nearestPossibleStartOffsetOfNodeWithInnerTextInfoList =
              startOffsetOfNodeWithInnerTextInfoList
          }
        }
        break
      } else {
        ++lastOffsetOfNodeWithInnerTextInfoList
      }
    }

    if (ranges.length) {
      rangesList.push(ranges)
    } else {
      if (DEBUG) {
        console.debug('[chrome-extension][find][rangesList] invalid state', {
          searchStringList,
          startOffsetOfSearchStringList,
          nodeWithInnerTextInfoList,
          nearestPossibleStartOffsetOfNodeWithInnerTextInfoList,
          searchString,
          lastOffsetOfNodeWithInnerTextInfoList,
          endOffset,
        })
      }
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
