import { resolveHighlightIndexOnComplete } from "@browser-find/core";
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

  const highlightIndex = resolveHighlightIndexOnComplete({
    matches: state.found,
    selection: state.selection,
    pendingNavigation: state.pendingNavigation,
  });

  if (highlightIndex === null) {
    return nextState;
  }

  const highlight = state.found[highlightIndex];
  if (!highlight) {
    return nextState;
  }

  nextState.highlightId = highlight.id;
  highlight.ranges[0].startContainer.parentElement?.scrollIntoViewIfNeeded(true);
  highlight.ranges.forEach((range) => {
    highlights({ range, isAdd: true, isThis: true });
    highlights({ range, isAdd: false, isThis: false });
  });
  return nextState;
};

export default reducer;
