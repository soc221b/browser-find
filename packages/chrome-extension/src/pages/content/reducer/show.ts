import { Action } from "../action";
import { State } from "../state";

type Reducer = (state: State, action: Action & { type: "Show" }) => State;

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    focusing: true,
    open: true,
  };
  return nextState;
};

export default reducer;
