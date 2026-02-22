import { theOthersKey, thisKey } from "../constants/highlight";

export function highlights({
  range,
  isAdd,
  isThis,
}: {
  range: Range;
  isAdd: boolean;
  isThis: boolean;
}) {
  const window = getWindow(range.startContainer);
  if (window === null) {
    return;
  }
  const key = isThis ? thisKey : theOthersKey;

  if (window.CSS.highlights.has(key) === false) {
    window.CSS.highlights.set(key, new Highlight());
  }
  if (isAdd) {
    window.CSS.highlights.get(key)?.add(range);
  } else {
    window.CSS.highlights.get(key)?.delete(range);
  }
}

function getWindow(node: null | Node | ParentNode): null | (Window & typeof globalThis) {
  return node?.parentNode?.ownerDocument?.defaultView ?? null;
}
