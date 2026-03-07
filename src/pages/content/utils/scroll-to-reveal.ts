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
    const scrollable = findScrollableAncestor(element);
    if (scrollable) {
      scrollable.scrollBy({ top: -overlap, behavior: "instant" });
    } else {
      window.scrollBy({ top: -overlap, behavior: "instant" });
    }
  }
}

function findScrollableAncestor(element: HTMLElement): HTMLElement | null {
  let el: HTMLElement | null = element.parentElement;
  while (el && el !== document.documentElement && el !== document.body) {
    if (el.scrollHeight > el.clientHeight) {
      const overflowY = window.getComputedStyle(el).overflowY;
      if (overflowY === "auto" || overflowY === "scroll") {
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}
