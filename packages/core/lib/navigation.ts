export type PendingNavigation = "next" | "previous" | null;

export type SearchMatch = {
  id: number;
  ranges: Range[];
};

export type SearchSelection = {
  focusNode: Node;
  focusOffset: number;
};

export type NavigationPlan = {
  currentIndex: number;
  nextIndex: number;
  nextId: number | null;
  isWrappingAround: boolean;
  shouldReSearch: boolean;
};

export type SearchNavigator = {
  getCurrentId: () => number | null;
  next: () => NavigationPlan;
  previous: () => NavigationPlan;
};

export const binarySearchIndex = <T, U>(
  array: T[],
  target: U,
  get: (value: T, index: number, obj: T[]) => U,
): number => {
  let first = 0;
  let last = array.length - 1;
  while (first <= last) {
    const mid = first + Math.floor((last - first) / 2);
    const midTarget = get(array[mid], mid, array);
    if (midTarget < target) {
      first = mid + 1;
    } else if (target < midTarget) {
      last = mid - 1;
    } else {
      return mid;
    }
  }
  return -1;
};

function getCurrentIndex(matches: SearchMatch[], currentId: number | null): number {
  if (currentId === null) {
    return -1;
  }

  return binarySearchIndex(matches, currentId, (match) => match.id);
}

export function planNextNavigation({
  matches,
  currentId,
}: {
  matches: SearchMatch[];
  currentId: number | null;
}): NavigationPlan {
  const currentIndex = getCurrentIndex(matches, currentId);
  const isWrappingAround = currentIndex >= matches.length - 1;
  const shouldReSearch = matches.length <= 1 || isWrappingAround;

  const nextIndex = currentIndex === -1 || isWrappingAround ? 0 : currentIndex + 1;
  const nextId = matches[nextIndex]?.id ?? null;

  return {
    currentIndex,
    nextIndex,
    nextId,
    isWrappingAround,
    shouldReSearch,
  };
}

export function planPreviousNavigation({
  matches,
  currentId,
}: {
  matches: SearchMatch[];
  currentId: number | null;
}): NavigationPlan {
  const currentIndex = getCurrentIndex(matches, currentId);
  const isWrappingAround = currentIndex <= 0;
  const shouldReSearch = matches.length <= 1 || isWrappingAround;

  const nextIndex = currentIndex > 0 ? currentIndex - 1 : matches.length - 1;
  const nextId = matches[nextIndex]?.id ?? null;

  return {
    currentIndex,
    nextIndex,
    nextId,
    isWrappingAround,
    shouldReSearch,
  };
}

export function createSearchNavigator({
  matches,
  currentId,
}: {
  matches: SearchMatch[];
  currentId: number | null;
}): SearchNavigator {
  let activeId = currentId;

  return {
    getCurrentId: () => activeId,
    next: () => {
      const plan = planNextNavigation({
        matches,
        currentId: activeId,
      });
      activeId = plan.nextId;
      return plan;
    },
    previous: () => {
      const plan = planPreviousNavigation({
        matches,
        currentId: activeId,
      });
      activeId = plan.nextId;
      return plan;
    },
  };
}

export function resolveHighlightIndexOnComplete({
  matches,
  selection,
  pendingNavigation,
}: {
  matches: SearchMatch[];
  selection: SearchSelection;
  pendingNavigation: PendingNavigation;
}): number | null {
  if (matches.length === 0) {
    return null;
  }

  let first = 0;
  let last = matches.length - 1;

  if (selection.focusNode.isConnected) {
    while (first < last) {
      const mid = first + Math.floor((last - first) / 2);
      const midMatch = matches[mid];
      const midRange = midMatch.ranges[0];

      if (!midRange) {
        first = mid + 1;
        continue;
      }

      if (
        selection.focusNode.compareDocumentPosition(midRange.startContainer) &
        Node.DOCUMENT_POSITION_PRECEDING
      ) {
        first = mid + 1;
      } else {
        last = mid;
      }
    }
  }

  let highlightIndex = first;
  const matchAtOrAfterSelection = matches[highlightIndex];
  const anchorRange = matchAtOrAfterSelection?.ranges[0];

  if (!anchorRange) {
    return 0;
  }

  if (
    selection.focusNode.isConnected &&
    selection.focusOffset > anchorRange.startOffset &&
    selection.focusNode === anchorRange.startContainer
  ) {
    highlightIndex = (highlightIndex + 1) % matches.length;
  }

  if (pendingNavigation === "next") {
    const nextCandidate = matches[highlightIndex]?.ranges[0];
    if (
      nextCandidate &&
      selection.focusNode === nextCandidate.startContainer &&
      selection.focusOffset === nextCandidate.startOffset
    ) {
      highlightIndex = (highlightIndex + 1) % matches.length;
    }
  } else if (pendingNavigation === "previous") {
    highlightIndex = (highlightIndex - 1 + matches.length) % matches.length;
  }

  return highlightIndex;
}
