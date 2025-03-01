import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleShouldMatchWholeWord' }) => State

const reducer: Reducer = (state, action) => {
  const nextState: State = {
    ...state,
    shouldMatchWholeWord: action.value,
  }
  return nextState
}

export default reducer
