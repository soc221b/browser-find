import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleShouldUseRegularExpression' }) => State

const reducer: Reducer = (state, action) => {
  const nextState: State = {
    ...state,
    shouldUseRegularExpression: action.value,
  }
  return nextState
}

export default reducer
