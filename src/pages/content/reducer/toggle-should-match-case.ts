import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleShouldMatchCase' }) => State

const reducer: Reducer = (state, action) => {
  const nextState: State = {
    ...state,
    shouldMatchCase: action.value,
  }
  return nextState
}

export default reducer
