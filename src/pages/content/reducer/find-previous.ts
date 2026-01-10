import { Action } from "../action";
import { State } from "../state";
import { binarySearchIndex } from "../utils/binary-search-index";
import { highlights } from "../utils/highlights";
import isMatchValid from "../utils/is-match-valid";

type Reducer = (state: State, action: Action & { type: "FindPrevious" }) => State;

const reducer: Reducer = (state) => {
  const index = binarySearchIndex(state.found, state.highlightId, (match) => match.id);
  let nextHighlightId: number | null = null;

  const isWrappingAround = index <= 0;
  const shouldReSearch = state.found.length <= 1 || isWrappingAround;

  if (index > 0) {
    nextHighlightId = state.found[index - 1].id;
  } else {
    nextHighlightId = state.found[state.found.length - 1]?.id ?? null;
  }

  const nextIndex = binarySearchIndex(state.found, nextHighlightId, (match) => match.id);
  const nextMatch = state.found[nextIndex];

  if (shouldReSearch || (nextMatch && !isMatchValid(nextMatch))) {
    const currentMatch = state.found[index];
    return {
      ...state,
      searchVersion: state.searchVersion + 1,
      pendingNavigation: "previous",
      selection:
        currentMatch && isMatchValid(currentMatch)
          ? {
              focusNode: currentMatch.ranges[0].startContainer,
              focusOffset: currentMatch.ranges[0].startOffset,
            }
          : state.selection,
    };
  }

  const nextState: State = {
    ...state,
    focusing: true,
    open: true,
    highlightId: nextHighlightId,
  };

  state.found[index]?.ranges.forEach((range) => {
    highlights({ range, isAdd: false, isThis: true });
    highlights({ range, isAdd: true, isThis: false });
  });
  nextState.found[
    binarySearchIndex(nextState.found, nextState.highlightId, (match) => match.id)
  ]?.ranges.forEach((range, index) => {
    if (index === 0) {
      range.startContainer.parentElement?.scrollIntoViewIfNeeded(true);
    }
    highlights({ range, isAdd: true, isThis: true });
    highlights({ range, isAdd: false, isThis: false });
  });

  return nextState;
};

export default reducer;
