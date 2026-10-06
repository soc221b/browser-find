import { Action } from "../action";
import { State } from "../state";

type Reducer = (state: State, action: Action & { type: "Subscribe" }) => State;

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    found: [],
    stale: state.stale.concat(state.found.flatMap((match) => match.ranges)),
    highlightId: null,
    subscribing: true,
  };

  return nextState;
};

export default reducer;
