import { Action } from "../action";
import { State } from "../state";
import blur from "./blur";
import close from "./close";
import commitHistory from "./commit-history";
import complete from "./complete";
import findNext from "./find-next";
import findPrevious from "./find-previous";
import focus from "./focus";
import input from "./input";
import makeSelection from "./make-selection";
import next from "./next";
import redo from "./redo";
import show from "./show";
import subscribe from "./subscribe";
import toggleShouldMatchCase from "./toggle-should-match-case";
import toggleShouldMatchWholeWord from "./toggle-should-match-whole-word";
import toggleShouldUseRegularExpression from "./toggle-should-use-regular-expression";

import undo from "./undo";

type Reducer = (state: State, action: Action) => State;

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case "Blur":
      return blur(state, action);
    case "Close":
      return close(state, action);
    case "CommitHistory":
      return commitHistory(state, action);
    case "Complete":
      return complete(state, action);
    case "FindNext":
      return findNext(state, action);
    case "FindPrevious":
      return findPrevious(state, action);
    case "Focus":
      return focus(state, action);
    case "Input":
      return input(state, action);
    case "MakeSelection":
      return makeSelection(state, action);
    case "Next":
      return next(state, action);
    case "Redo":
      return redo(state, action);
    case "Show":
      return show(state, action);
    case "Subscribe":
      return subscribe(state, action);
    case "ToggleShouldMatchCase":
      return toggleShouldMatchCase(state, action);
    case "ToggleShouldMatchWholeWord":
      return toggleShouldMatchWholeWord(state, action);
    case "ToggleShouldUseRegularExpression":
      return toggleShouldUseRegularExpression(state, action);
    case "Undo":
      return undo(state, action);
    default:
      const _: never = action;
      throw Error("Unimplemented");
  }
};

export default reducer;
