import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'MakeSelection' }) => State

const reducer: Reducer = (state, action) => {
  const nextState: State = {
    ...state,
    selection: action.value,
  }
  return nextState
}

export default reducer
