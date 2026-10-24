export function scrollIntoViewIfNeeded(range: Range) {
  openAncestorDetails(range.startContainer);
  range.startContainer.parentElement?.scrollIntoViewIfNeeded(true);

  const window = range.startContainer.ownerDocument?.defaultView;
  if (!window) {
    return;
  }
  const rect = range.getBoundingClientRect();
  if (rect.top < 0 || rect.bottom > window.innerHeight) {
    window.scrollBy(0, rect.top + rect.height / 2 - window.innerHeight / 2);
  }
}

function openAncestorDetails(node: Node) {
  for (let element = node.parentElement; element; element = element.parentElement) {
    if (
      element instanceof HTMLDetailsElement &&
      !element.open &&
      !element.querySelector(":scope > summary")?.contains(node)
    ) {
      element.open = true;
    }
  }
}
