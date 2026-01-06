import { Action } from "../action";
import { State } from "../state";
import { highlights } from "../utils/highlights";

type Reducer = (state: State, action: Action & { type: "Complete" }) => State;

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    subscribing: false,
  };

  if (state.found.length === 0) {
    return nextState;
  }

  const selection = state.selection;

  let first = 0;
  let last = state.found.length - 1;
  while (first < last) {
    const mid = first + Math.floor((last - first) / 2);
    const match = state.found[mid];
    const range = match.ranges[0];
    const startContainer = range.startContainer;
    if (
      selection.focusNode.compareDocumentPosition(startContainer) & Node.DOCUMENT_POSITION_PRECEDING
    ) {
      first = mid + 1;
    } else {
      last = mid;
    }
  }

  const highlight = (() => {
    const highlight = state.found[first];
    if (selection.focusOffset <= highlight.ranges[0].startOffset) {
      return highlight;
    } else {
      return state.found[(first + 1) % state.found.length];
    }
  })();

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
