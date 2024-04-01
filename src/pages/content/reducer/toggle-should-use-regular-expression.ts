import { Action } from '../action'
import { State } from '../state'

type Reducer = (
  state: State,
  action: Action & { type: 'ToggleShouldUseRegularExpression' },
) => State

const reducer: Reducer = (state, action) => {
  chrome.storage.local.set({
    shouldUseRegularExpression: action.value,
  })
  return {
    ...state,
    matchId: null,
    matches: [],
    shouldUseRegularExpression: action.value,
  }
}

export default reducer
