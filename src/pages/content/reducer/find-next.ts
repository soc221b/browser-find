import { Action } from '../action'
import { State } from '../state'

type Reducer = (state: State, action: Action & { type: 'FindNext' }) => State

const reducer: Reducer = (state) => {
  const nextState = {
    ...state,
    focusing: true,
    open: true,
  }
  const index = state.matches.findIndex((match) => state.matchId === match.id)
  if (index === -1) {
    nextState.matchId = state.matches[0]?.id ?? null
  } else if (index >= state.matches.length - 1) {
    nextState.matchId = state.matches[0].id
  } else {
    nextState.matchId = state.matches[index + 1].id ?? null
  }

  state.matches[index]?.ranges.forEach((range) => {
    CSS.highlights.get('browser-find-match')?.delete(range)
    CSS.highlights.get('browser-find')?.add(range)
  })
  nextState.matches
    .find((match) => nextState.matchId === match.id)
    ?.ranges.forEach((range, index) => {
      if (index === 0) {
        range.startContainer.parentElement?.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
          inline: 'nearest',
        })
      }
      CSS.highlights.get('browser-find-match')?.add(range)
      CSS.highlights.get('browser-find')?.delete(range)
    })

  return nextState
}

export default reducer
