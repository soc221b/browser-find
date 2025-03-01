import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'Close' }) => State

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    focusing: false,
    open: false,
  }
  return nextState
}

export default reducer
