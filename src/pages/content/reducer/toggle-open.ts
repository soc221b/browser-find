import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleOpen' }) => State

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    focusing: action.value,
    open: action.value,
  }
}

export default reducer
