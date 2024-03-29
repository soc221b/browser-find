import { Action } from '../action'
import { State } from '../state'

type Reducer = (
  state: State,
  action: Action & { type: 'FindPrevious' },
) => State

const reducer: Reducer = (state) => {
  const nextState = {
    ...state,
    focusing: true,
    open: true,
  }
  const index = state.matches.findIndex((match) => state.matchId === match.id)
  if (index > 0) {
    nextState.matchId = state.matches[index - 1].id
  } else {
    nextState.matchId = state.matches[state.matches.length - 1]?.id ?? null
  }

  nextState.matches
    .find((match) => match.id === nextState.matchId)
    ?.scrollIntoView()

  return nextState
}

export default reducer
