import { Redo } from "../action/redo";
import { State } from "../state";

const redo = (state: State, _action: Redo): State => {
  if (state.historyIndex >= state.history.length - 1) {
    return state;
  }

  const newHistoryIndex = state.historyIndex + 1;
  const snapshot = state.history[newHistoryIndex];

  return {
    ...state,
    text: snapshot.text,
    historyIndex: newHistoryIndex,
    lastCommittedText: snapshot.text,
    searchVersion: state.searchVersion + 1,
  };
};

export default redo;
