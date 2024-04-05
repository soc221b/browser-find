import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'Match' }) => State

const reducer: Reducer = (state, action) => {
  const nextState = {
    ...state,
  }
  nextState.matches = state.matches.concat(action.match)
  if (nextState.matchId === null) {
    nextState.matchId = nextState.matches[0].id
    action.match.ranges.forEach((range, index) => {
      if (index === 0) {
        range.startContainer.parentElement?.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
          inline: 'nearest',
        })
      }
      CSS.highlights.get('browser-find-match')?.add(range)
    })
  } else {
    action.match.ranges.forEach((range) => {
      CSS.highlights.get('browser-find')?.add(range)
    })
  }

  return nextState
}

export default reducer
