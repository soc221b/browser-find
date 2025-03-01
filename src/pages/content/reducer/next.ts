import { Action } from '../action'
import { State } from '../state'
import { highlights } from '../utils/highlights'

type Reducer = (state: State, action: Action & { type: 'Next' }) => State

const reducer: Reducer = (state, action) => {
  const nextState: State = {
    ...state,
  }
  nextState.found = state.found.concat(action.value)
  action.value.ranges.forEach((range) => {
    highlights({ range, isAdd: true, isThis: false })
  })

  return nextState
}

export default reducer
