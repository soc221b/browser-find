import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleFinding' }) => State

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    finding: action.value,
  }
}

export default reducer
