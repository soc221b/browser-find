import { Action } from "../action";
import { State } from "../state";

type Reducer = (state: State, action: Action & { type: "Show" }) => State;

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    focusing: true,
    open: true,
    searchVersion: state.open ? state.searchVersion : state.searchVersion + 1,
    shouldHighlight: state.open && state.shouldHighlight,
  };
  return nextState;
};

export default reducer;
