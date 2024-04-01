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

export function getNodeWithInnerTextList({ body }: { body: HTMLElement }) {
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
      innerText = innerText.trim() + '\n'

      nodeWithInnerTextList.push({
        node,
        innerText,
      })
    }
  }
  if (nodeWithInnerTextList.length) {
    nodeWithInnerTextList[nodeWithInnerTextList.length - 1].innerText =
      nodeWithInnerTextList[nodeWithInnerTextList.length - 1].innerText.trim()
  }
  return nodeWithInnerTextList
}
