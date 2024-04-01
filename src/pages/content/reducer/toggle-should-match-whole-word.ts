import { Action } from '../action'
import { State } from '../state'

type Reducer = (
  state: State,
  action: Action & { type: 'ToggleShouldMatchWholeWord' },
) => State

const reducer: Reducer = (state, action) => {
  chrome.storage.local.set({
    shouldMatchWholeWord: action.value,
  })
  return {
    ...state,
    matchId: null,
    matches: [],
    shouldMatchWholeWord: action.value,
  }
}

export default reducer
