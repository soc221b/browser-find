import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'ToggleShouldMatchWholeWord' }) => State

const reducer: Reducer = (state, action) => {
  return {
    ...state,
    shouldMatchWholeWord: action.value,
  }
}

export default reducer
