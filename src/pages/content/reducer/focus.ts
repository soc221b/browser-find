import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'Focus' }) => State

const reducer: Reducer = (state) => {
  const nextState: State = {
    ...state,
    focusing: true,
  }
  return nextState
}

export default reducer
