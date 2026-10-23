export function scrollIntoViewIfNeeded(range: Range) {
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
