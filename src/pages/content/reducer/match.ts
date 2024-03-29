import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'Match' }) => State

const reducer: Reducer = (state, action) => {
  const nextState = {
    ...state,
  }
  nextState.matches = state.matches.concat(action.match)
  if (nextState.matchId === null) {
    nextState.matchId = nextState.matches[0].id
    nextState.matches[0].scrollIntoView()
  }

  return nextState
}

export default reducer
