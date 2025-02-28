import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ChangeSelection' }) => State

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    focusNode: action.focusNode,
  }
}

export default reducer
