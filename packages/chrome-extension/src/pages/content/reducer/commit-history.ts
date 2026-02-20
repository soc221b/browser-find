import { CommitHistory } from "../action/commit-history";
import { State } from "../state";

const MAX_HISTORY = 100;

const commitHistory = (state: State, _action: CommitHistory): State => {
  if (state.text === state.lastCommittedText) {
    return state;
  }

  // Clear future history (anything after historyIndex)
  const newHistory = state.history.slice(0, state.historyIndex + 1);

  // Push new snapshot
  newHistory.push({ text: state.text });

  // Enforce limit
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }

  return {
    ...state,
    history: newHistory,
    historyIndex: newHistory.length - 1,
    lastCommittedText: state.text,
  };
};

export default commitHistory;
