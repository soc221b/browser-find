import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'FindNext' }) => State

const reducer: Reducer = (state) => {
  const nextState = {
    ...state,
    focusing: true,
    open: true,
  }
  const index = state.matches.findIndex((match) => state.matchId === match.id)
  if (index === -1) {
    nextState.matchId = state.matches[0]?.id ?? null
  } else if (index >= state.matches.length - 1) {
    nextState.matchId = state.matches[0].id
  } else {
    nextState.matchId = state.matches[index + 1].id ?? null
  }

  return nextState
}

export default reducer
