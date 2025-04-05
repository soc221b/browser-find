import { Action } from "../action";
import { State } from "../state";

type Reducer = (state: State, action: Action & { type: "Blur" }) => State;

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    focusing: false,
  };
  return nextState;
};

export default reducer;
