import { Action } from "../action";
import { State } from "../state";
import { highlights } from "../utils/highlights";

type Reducer = (state: State, action: Action & { type: "Complete" }) => State;

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    subscribing: false,
    pendingNavigation: null,
  };

  if (state.found.length === 0) {
    return nextState;
  }

  const selection = state.selection;

  let first = 0;
  let last = state.found.length - 1;

  if (selection.focusNode.isConnected) {
    while (first < last) {
      const mid = first + Math.floor((last - first) / 2);
      const match = state.found[mid];
      const range = match.ranges[0];
      const startContainer = range.startContainer;
      if (
        selection.focusNode.compareDocumentPosition(startContainer) &
        Node.DOCUMENT_POSITION_PRECEDING
      ) {
        first = mid + 1;
      } else {
        last = mid;
      }
    }
  }

  let highlightIndex = first;
  const matchAtOrAfterSelection = state.found[highlightIndex];

  if (
    selection.focusNode.isConnected &&
    selection.focusOffset > matchAtOrAfterSelection.ranges[0].startOffset &&
    selection.focusNode === matchAtOrAfterSelection.ranges[0].startContainer
  ) {
    highlightIndex = (highlightIndex + 1) % state.found.length;
  }

  if (state.pendingNavigation === "next") {
    // If we were explicitly navigating "Next", and we found the same match as anchor,
    // we should move to the next one.
    // If we found a DIFFERENT match (because anchor was removed), then 'first' is already the "next" valid match.
    if (
      selection.focusNode === state.found[highlightIndex].ranges[0].startContainer &&
      selection.focusOffset === state.found[highlightIndex].ranges[0].startOffset
    ) {
      highlightIndex = (highlightIndex + 1) % state.found.length;
    }
  } else if (state.pendingNavigation === "previous") {
    // For previous, if we found the anchor match, we go back one.
    // If we found a match AFTER the anchor (because anchor was removed), we still go back one to get the "previous" valid match.
    highlightIndex = (highlightIndex - 1 + state.found.length) % state.found.length;
  }

  const highlight = state.found[highlightIndex];
  nextState.highlightId = highlight.id;
  highlight.ranges[0].startContainer.parentElement?.scrollIntoView({
    behavior: "instant",
    block: "nearest",
    inline: "nearest",
  });
  highlight.ranges.forEach((range) => {
    highlights({ range, isAdd: true, isThis: true });
    highlights({ range, isAdd: false, isThis: false });
  });
  return nextState;
};

export default reducer;
