import { Action } from '../action'
import { State } from '../state'
import { highlights } from '../utils/highlights'

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
    highlights({ range, isAdd: false, isThis: true })
    highlights({ range, isAdd: true, isThis: false })
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
      highlights({ range, isAdd: true, isThis: true })
      highlights({ range, isAdd: false, isThis: false })
    })

  return nextState
}

export default reducer
