import { Action } from '../action'
import { State } from '../state'
import { highlights } from '../utils/highlights'

type Reducer = (state: State, action: Action & { type: 'ClearMatch' }) => State

const reducer: Reducer = (state) => {
  const nextState = {
    ...state,
    matches: [],
    matchId: null,
  }

  state.matches.forEach((match) => {
    match.ranges.forEach((range) => {
      highlights({ range, isAdd: false, isThis: true })
      highlights({ range, isAdd: false, isThis: false })
    })
  })

  return nextState
}

export default reducer
