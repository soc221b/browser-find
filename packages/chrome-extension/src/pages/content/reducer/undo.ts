import { Undo } from "../action/undo";
import { State } from "../state";

const undo = (state: State, _action: Undo): State => {
  if (state.historyIndex <= 0) {
    return state;
  }

  const newHistoryIndex = state.historyIndex - 1;
  const snapshot = state.history[newHistoryIndex];

  return {
    ...state,
    text: snapshot.text,
    historyIndex: newHistoryIndex,
    lastCommittedText: snapshot.text,
    searchVersion: state.searchVersion + 1,
  };
};

export default undo;
