import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'Input' }) => State

const reducer: Reducer = (state, action) => {
  const nextState: State = {
    ...state,
    text: action.value,
  }
  return nextState
}

export default reducer
