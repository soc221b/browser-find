import { planPreviousNavigation } from "@browser-find/core";
import { Action } from "../action";
import { State } from "../state";
import { highlights } from "../utils/highlights";
import isMatchValid from "../utils/is-match-valid";

type Reducer = (state: State, action: Action & { type: "FindPrevious" }) => State;

const reducer: Reducer = (state) => {
  const navigation = planPreviousNavigation({
    matches: state.found,
    currentId: state.highlightId,
  });
  const nextMatch = state.found[navigation.nextIndex];

  if (navigation.shouldReSearch || (nextMatch && !isMatchValid(nextMatch))) {
    const currentMatch = state.found[navigation.currentIndex];
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
    highlightId: navigation.nextId,
  };

  state.found[navigation.currentIndex]?.ranges.forEach((range) => {
    highlights({ range, isAdd: false, isThis: true });
    highlights({ range, isAdd: true, isThis: false });
  });
  nextState.found[navigation.nextIndex]?.ranges.forEach((range, index) => {
    if (index === 0) {
      range.startContainer.parentElement?.scrollIntoViewIfNeeded(true);
    }
    highlights({ range, isAdd: true, isThis: true });
    highlights({ range, isAdd: false, isThis: false });
  });

  return nextState;
};

export default reducer;
