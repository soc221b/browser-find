import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleFocus' }) => State

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    focusing: action.value,
  }
}

export default reducer
