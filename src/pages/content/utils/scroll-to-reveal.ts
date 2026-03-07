export function scrollToReveal(element: HTMLElement): void {
  element.scrollIntoViewIfNeeded(true);

  const findBarRoot = document.querySelector("#browser-find-top-layer .root");
  if (!findBarRoot) return;

  const elementRect = element.getBoundingClientRect();
  const findBarRect = findBarRoot.getBoundingClientRect();

  const isVerticallyOverlapping =
    elementRect.top < findBarRect.bottom && elementRect.bottom > findBarRect.top;
  const isHorizontallyOverlapping =
    elementRect.right > findBarRect.left && elementRect.left < findBarRect.right;

  if (isVerticallyOverlapping && isHorizontallyOverlapping) {
    const overlap = Math.max(0, findBarRect.bottom - elementRect.top);
    window.scrollBy({ top: -overlap, behavior: "instant" });
  }
}
