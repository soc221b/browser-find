import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleShouldMatchCase' }) => State

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    shouldMatchCase: action.value,
  }
}

export default reducer
