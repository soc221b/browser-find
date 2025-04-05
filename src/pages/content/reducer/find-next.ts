import { Action } from "../action";
import { State } from "../state";
import { binarySearchIndex } from "../utils/binary-search-index";
import { highlights } from "../utils/highlights";

type Reducer = (state: State, action: Action & { type: "FindNext" }) => State;

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    focusing: true,
    open: true,
  };
  const index = binarySearchIndex(state.found, state.highlightId, (match) => match.id);
  if (index === -1) {
    nextState.highlightId = state.found[0]?.id ?? null;
  } else if (index >= state.found.length - 1) {
    nextState.highlightId = state.found[0].id;
  } else {
    nextState.highlightId = state.found[index + 1].id ?? null;
  }

  state.found[index]?.ranges.forEach((range) => {
    highlights({ range, isAdd: false, isThis: true });
    highlights({ range, isAdd: true, isThis: false });
  });

  nextState.found[
    binarySearchIndex(nextState.found, nextState.highlightId, (match) => match.id)
  ]?.ranges.forEach((range, index) => {
    if (index === 0) {
      range.startContainer.parentElement?.scrollIntoView({
        behavior: "instant",
        block: "nearest",
        inline: "nearest",
      });
    }
    highlights({ range, isAdd: true, isThis: true });
    highlights({ range, isAdd: false, isThis: false });
  });

  return nextState;
};

export default reducer;
