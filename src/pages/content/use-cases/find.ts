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

  ;(async () => {
    if (!CSS.highlights) {
      return
    }

    CSS.highlights.delete('browser-find-match')
    CSS.highlights.delete('browser-find')

    if (text === '') {
      return
    }

    let pattern = text
    pattern = shouldUseRegularExpression
      ? pattern
      : pattern.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') // https://stackoverflow.com/a/9310752/7122623
    pattern = shouldMatchWholeWord ? `\\b${pattern}\\b` : `${pattern}`
    let flags = ''
    flags += 'g'
    flags += shouldMatchCase ? '' : 'i'

    const treeWalker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
    )
    const nodes = new Set([treeWalker.nextNode()])
    const rangeMap: Map<Node, Map<number, number>> = new Map()
    while (nodes.size) {
      if (isCancelled) {
        return
      }

      const iteratorResult = nodes.values().next()
      if (iteratorResult.done) {
        break
      }
      const currentNode = iteratorResult.value
      if (currentNode === null) {
        break
      }
      nodes.delete(currentNode)
      if (currentNode.textContent) {
        const re = new RegExp(pattern, flags)
        let array: null | RegExpExecArray = null
        const textContent = currentNode.textContent
        while ((array = re.exec(textContent)) !== null) {
          if (isCancelled) {
            return
          }

          if (rangeMap.has(currentNode) === false) {
            rangeMap.set(currentNode, new Map())
          }
          rangeMap
            .get(currentNode)!
            .set(array.index, array.index + array[0].length)
        }
      }

      nodes.add(treeWalker.nextNode())
    }
    const ranges = Array.from(rangeMap.entries())
      .map(([node, map]) => {
        return Array.from(map.entries()).map(([startOffset, endOffset]) => {
          const range = new Range()
          range.setStart(node, startOffset)
          range.setEnd(node, endOffset)
          return range
        })
      })
      .flat()
    CSS.highlights.set('browser-find', new Highlight(...ranges))
    ranges.forEach((range, index) => {
      onMatch({
        id: index.toString(),
        scrollIntoView: () => {
          CSS.highlights.set(
            'browser-find',
            new Highlight(...ranges.filter((r) => r !== range)),
          )
          CSS.highlights.set('browser-find-match', new Highlight(range))
          range.startContainer.parentElement?.scrollIntoView({
            behavior: 'instant',
            block: 'nearest',
            inline: 'nearest',
          })
        },
      })
    })
  })().catch(() => {})

  return cancel
}

export default find
