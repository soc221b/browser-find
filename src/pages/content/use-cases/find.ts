type Find = (_: {
  documentElement: HTMLElement

  text: string

  shouldMatchCase: boolean

  shouldMatchWholeWord: boolean

  shouldUseRegularExpression: boolean

  onNext: (ranges: Range[]) => void

  onComplete: () => void
}) => {
  stop: () => void
}

export const find: Find = ({
  documentElement,
  text,
  shouldMatchCase,
  shouldMatchWholeWord,
  shouldUseRegularExpression,
  onNext,
  onComplete,
}) => {
  let isStopped = false
  const stop = () => {
    isStopped = true
  }

  const regex = createRegex({
    text,
    shouldMatchCase,
    shouldMatchWholeWord,
    shouldUseRegularExpression,
  })

  const nodeMaps = createNodeMaps({ documentElement })

  const rangesList = createRangesList({
    regex,
    nodeMaps,
  })

  rangesList.forEach((ranges) => onNext(ranges))
  onComplete()

  return { stop }
}

function createRegex({
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
    return new RegExp('^\\b$', 'gm')
  }
}

type NodeMap = {
  node: Node
  textContentStartOffset: number
  textContentEndOffset: number
  innerTextLike: string
}
function createNodeMaps({
  documentElement,
}: {
  documentElement: HTMLElement
}): NodeMap[] {
  let nodeMaps: NodeMap[] = []

  let DFSStack: {
    childNode: null | ChildNode
    nextChildNodeIndex: number
  }[] = [
    {
      childNode: documentElement,
      nextChildNodeIndex: 0,
    },
  ]
  while (DFSStack.length) {
    const top = DFSStack[DFSStack.length - 1]
    if (top.childNode === null) {
      DFSStack.pop()
      continue
    }

    const childNodes = top.childNode.childNodes
    const childIndex = top.nextChildNodeIndex
    if (childNodes.length <= childIndex) {
      DFSStack.pop()
      continue
    }

    const childNode = childNodes[childIndex]
    switchLabel: switch (childNode.nodeType) {
      case Node.ELEMENT_NODE: {
        const elementNode = childNode as Element
        if (elementNode.id === 'browser-find-top-layer') {
          break
        }

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

        DFSStack.push({
          childNode: elementNode,
          nextChildNodeIndex: 0,
        })
        break
      }
      case Node.TEXT_NODE: {
        if (childNode.textContent && childNode.textContent.trim()) {
          // let innerText = childNode.textContent
          // const parentElement = childNode.parentElement
          // if (parentElement) {
          //   const CSSStyleDeclarationOfParentElement =
          //     getComputedStyle(parentElement)
          //   if (
          //     CSSStyleDeclarationOfParentElement.textTransform === 'uppercase'
          //   ) {
          //     innerText = innerText.toUpperCase()
          //   }
          //   if (
          //     CSSStyleDeclarationOfParentElement.textTransform === 'lowercase'
          //   ) {
          //     innerText = innerText.toLowerCase()
          //   }
          //   innerText = innerText.replace(/(\S.*)\s+(.*\S)/g, '$1 $2')
          //   if (parentElement.childNodes[0] === childNode) {
          //     innerText = innerText.trimStart()
          //   } else {
          //     if (
          //       childNode.previousSibling instanceof Element &&
          //       childNode.previousSibling.tagName === 'BR'
          //     ) {
          //       innerText = innerText.trimStart()
          //     }
          //   }
          //   if (
          //     parentElement.childNodes[parentElement.childNodes.length - 1] ===
          //     childNode
          //   ) {
          //     innerText = innerText.trimEnd()
          //   } else {
          //     if (/\s+$/.test(innerText)) {
          //       innerText = innerText.trimEnd() + ' '
          //     }
          //   }
          //   if (parentElement.tagName === 'OPTION') {
          //     const parentParentElement = parentElement.parentElement
          //     if (parentParentElement) {
          //       if (parentParentElement.tagName === 'SELECT') {
          //         if (parentParentElement.childNodes[0] !== parentElement) {
          //           // nodeMaps.push({
          //           //   node: documentElement.ownerDocument.createTextNode(''),
          //           //   innerTextLike: '\n',
          //           // })
          //         }
          //       }
          //     }
          //   }
          // }
          let offset = 0
          childNode.textContent.split('').forEach((char, index) => {
            nodeMaps.push({
              node: childNode,
              textContentStartOffset: index + offset,
              textContentEndOffset: index + offset + 1,
              innerTextLike: char,
            })
          })
        } else {
          // nodeMaps.push({
          //   node: childNode,
          //   innerTextLike: ' ',
          // })
        }
        break
      }
    }

    ++top.nextChildNodeIndex
  }

  return nodeMaps
}

function createRangesList({
  nodeMaps,
  regex,
}: {
  nodeMaps: NodeMap[]
  regex: RegExp
}): Range[][] {
  const rangesList: Range[][] = []

  const innerTextLikeIndexToNodeMapIndex: Record<number, number> = {}
  let innerTextLike = ''
  for (const [index, nodeMap] of nodeMaps.entries()) {
    innerTextLikeIndexToNodeMapIndex[innerTextLike.length] = index
    innerTextLike += nodeMap.innerTextLike
  }
  for (const array of innerTextLike.matchAll(regex)) {
    if (array[0] === '') {
      break
    }

    const ranges: Range[] = []

    for (
      let innerTextLikeIndex = array.index;
      innerTextLikeIndex < array.index + array[0].length;
      ++innerTextLikeIndex
    ) {
      const range = new Range()

      const nodeMapIndex = innerTextLikeIndexToNodeMapIndex[innerTextLikeIndex]
      const nodeMap = nodeMaps[nodeMapIndex]
      range.setStart(nodeMap.node, nodeMap.textContentStartOffset)
      range.setEnd(nodeMap.node, nodeMap.textContentEndOffset)

      ranges.push(range)
    }

    rangesList.push(ranges)
  }

  return rangesList
}
