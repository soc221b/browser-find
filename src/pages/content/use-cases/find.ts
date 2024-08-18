import sleep from '../utils/sleep'

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

  ;(async () => {
    await sleep('raf')
    if (isStopped) {
      return
    }

    const regex = createRegex({
      text,
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
    })

    await sleep('raf')
    if (isStopped) {
      return
    }

    const nodeMaps = await createNodeMaps({ documentElement })

    await sleep('raf')
    if (isStopped) {
      return
    }

    const rangesList = matchAll({
      regex,
      nodeMaps,
    })
    ;(async () => {
      let i = 0
      while (i < rangesList.length) {
        if (i % 1000 === 0) {
          await sleep('raf')
        }
        if (isStopped) {
          break
        }

        onNext(rangesList[i])
        ++i
      }
      onComplete()
    })()
  })()

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
    pattern = shouldUseRegularExpression ? pattern : pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') // https://stackoverflow.com/a/9310752/7122623
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
async function createNodeMaps({ documentElement }: { documentElement: HTMLElement }): Promise<NodeMap[]> {
  let nodeMaps: NodeMap[] = []

  let DFSStack: {
    parentElement: null | ChildNode
    nextChildNodeIndex: number
  }[] = [
    {
      parentElement: documentElement,
      nextChildNodeIndex: 0,
    },
  ]
  let i = 0
  while (DFSStack.length) {
    if (i++ % 1000 === 0) {
      await sleep('raf')
    }
    const top = DFSStack[DFSStack.length - 1]
    if (top.parentElement === null) {
      DFSStack.pop()
      continue
    }

    const parentElement = top.parentElement as Element
    const childNodes = top.parentElement.childNodes
    const childNodeIndex = top.nextChildNodeIndex
    if (childNodes.length <= childNodeIndex) {
      DFSStack.pop()
      continue
    }

    const childNode = childNodes[childNodeIndex]
    switchLabel: switch (childNode.nodeType) {
      case Node.ELEMENT_NODE: {
        const element = childNode as Element
        if (element.id === 'browser-find-top-layer') {
          break
        }

        const ignoredTagNames = ['SCRIPT', 'NOSCRIPT', 'STYLE', 'SELECT']
        if (ignoredTagNames.includes(element.tagName)) {
          break
        }
        if (element.tagName === 'IFRAME') {
          const iframeElement = element as HTMLIFrameElement
          if (iframeElement.contentDocument) {
            DFSStack.push({
              parentElement: iframeElement.contentDocument.documentElement,
              nextChildNodeIndex: 0,
            })
          }
          break
        }

        if (element.classList.contains('sr-only')) {
          break
        }

        // FIXME: performance
        const CSSStyleDeclaration = getComputedStyle(element)
        if (CSSStyleDeclaration.display === 'none') {
          break switchLabel
        }
        if (CSSStyleDeclaration.visibility === 'hidden') {
          break switchLabel
        }

        DFSStack.push({
          parentElement: element,
          nextChildNodeIndex: 0,
        })
        break
      }
      case Node.TEXT_NODE: {
        const CSSStyleDeclaration = getComputedStyle(parentElement)
        const whiteSpaceCollapse = getWhiteSpaceCollapse(CSSStyleDeclaration)
        if (childNode.textContent && childNode.textContent.trim()) {
          const firstIndexAfterLeadingSpace = childNode.textContent.match(/\S/)?.index ?? -1
          const firstIndexOfTrailingSpace = childNode.textContent.match(/\s+$/)?.index ?? -1
          const textContentLowerCase = childNode.textContent.toLowerCase()
          childNode.textContent.split('').forEach((textContentPart, index) => {
            let innerTextLike = textContentPart
            switch (CSSStyleDeclaration.textTransform) {
              case 'uppercase':
                innerTextLike = innerTextLike.toUpperCase()
                break
              case 'lowercase':
                innerTextLike = textContentLowerCase[index]
                break
              case 'capitalize':
                innerTextLike = (index === 0 ? /\w/.test(innerTextLike) : /\W/.test(childNode.textContent![index - 1]))
                  ? innerTextLike.toUpperCase()
                  : innerTextLike
                break
            }
            if (whiteSpaceCollapse === 'collapse' && innerTextLike === '\n') {
              if (nodeMaps.length ? nodeMaps[nodeMaps.length - 1].innerTextLike !== '\n' : true) {
                innerTextLike = ' '
              }
            }
            if (['collapse', 'preserve-breaks'].includes(whiteSpaceCollapse)) {
              if (
                (nodeMaps.length ? nodeMaps[nodeMaps.length - 1].innerTextLike === ' ' : true) &&
                index < firstIndexAfterLeadingSpace
              ) {
                innerTextLike = ''
              }
              if (-1 < firstIndexOfTrailingSpace && firstIndexOfTrailingSpace < index) {
                innerTextLike = ''
              }
              if (/[ \n]/.test(textContentPart) && /[ \n]/.test(childNode.textContent?.[index - 1] ?? '')) {
                innerTextLike = ''
              }
            }

            let textContentStartOffset = index

            let textContentEndOffset = textContentStartOffset + innerTextLike.length

            nodeMaps.push({
              node: childNode,
              textContentStartOffset,
              textContentEndOffset,
              innerTextLike,
            })
          })
        } else {
          if (whiteSpaceCollapse === 'collapse') {
            let node: ChildNode = childNode
            let shouldCollapse = true
            while (node.parentElement !== null) {
              const CSSStyleDeclaration = getComputedStyle(node.parentElement)
              const whiteSpaceCollapse = getWhiteSpaceCollapse(CSSStyleDeclaration)
              if (whiteSpaceCollapse === 'collapse') {
                if (node.parentElement.lastChild === node) {
                  node = node.parentElement
                } else {
                  if (nodeMaps.length && /\s/.test(nodeMaps[nodeMaps.length - 1].innerTextLike)) {
                  } else {
                    shouldCollapse = false
                  }
                  break
                }
              } else {
                break
              }
            }
            nodeMaps.push({
              node: childNode,
              textContentStartOffset: 0,
              textContentEndOffset: 1,
              innerTextLike: shouldCollapse ? '' : ' ',
            })
          } else {
            nodeMaps.push({
              node: childNode,
              textContentStartOffset: 0,
              textContentEndOffset: 1,
              innerTextLike: childNode.textContent?.[0] ?? ' ',
            })
          }
        }
        break
      }
    }

    ++top.nextChildNodeIndex
  }

  nodeMaps = nodeMaps.map((nodeMap) => {
    return {
      ...nodeMap,
      innerTextLike: nodeMap.innerTextLike.replace('\xa0', ' '),
    }
  })

  return nodeMaps
}

function matchAll({ nodeMaps, regex }: { nodeMaps: NodeMap[]; regex: RegExp }): Range[][] {
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

function getWhiteSpaceCollapse(CSSStyleDeclaration: CSSStyleDeclaration): string {
  if ((CSSStyleDeclaration as any).whiteSpaceCollapse) {
    return (CSSStyleDeclaration as any).whiteSpaceCollapse
  } else {
    // whiteSpaceCollapse is undefined in JSDOM
  }

  if (CSSStyleDeclaration.whiteSpace) {
    return (
      {
        normal: 'collapse',
        nowrap: 'collapse',
        pre: 'preserve',
        'pre-wrap': 'preserve',
        'pre-line': 'preserve-breaks',
        'break-spaces': 'break-spaces',
      }[CSSStyleDeclaration.whiteSpace] ?? 'collapse'
    )
  } else {
    // whiteSpace is undefined in JSDOM
  }

  return 'collapse'
}
