import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'Type' }) => State

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    text: action.value,
    matches: [],
    matchId: null,
  }
}

export default reducer
