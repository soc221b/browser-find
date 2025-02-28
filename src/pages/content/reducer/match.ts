import { Action } from '../action'
import { State } from '../state'
import { highlights } from '../utils/highlights'

type Reducer = (state: State, action: Action & { type: 'Match' }) => State

const reducer: Reducer = (state, action) => {
  const nextState = {
    ...state,
  }
  nextState.matches = state.matches.concat(action.match)
  action.match.ranges.forEach((range) => {
    highlights({ range, isAdd: true, isThis: false })
  })

  return nextState
}

export default reducer
