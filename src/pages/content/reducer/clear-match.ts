import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ClearMatch' }) => State

const reducer: Reducer = (state) => {
  const nextState = {
    ...state,
    matches: [],
    matchId: null,
  }

  return nextState
}

export default reducer
