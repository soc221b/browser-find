import { Action } from '../action'
import { State } from '../state'
import { binarySearchIndex } from '../utils/binary-search-index'
import { highlights } from '../utils/highlights'

type Reducer = (state: State, action: Action & { type: 'FindPrevious' }) => State

const reducer: Reducer = (state) => {
  const nextState = {
    ...state,
    focusing: true,
    open: true,
  }
  const index = binarySearchIndex(state.matches, state.matchId, (match) => match.id)
  if (index > 0) {
    nextState.matchId = state.matches[index - 1].id
  } else {
    nextState.matchId = state.matches[state.matches.length - 1]?.id ?? null
  }

  state.matches[index]?.ranges.forEach((range) => {
    highlights({ range, isAdd: false, isThis: true })
    highlights({ range, isAdd: true, isThis: false })
  })
  nextState.matches[binarySearchIndex(nextState.matches, nextState.matchId, (match) => match.id)]?.ranges.forEach(
    (range, index) => {
      if (index === 0) {
        range.startContainer.parentElement?.scrollIntoView({
          behavior: 'instant',
          block: 'nearest',
          inline: 'nearest',
        })
      }
      highlights({ range, isAdd: true, isThis: true })
      highlights({ range, isAdd: false, isThis: false })
    },
  )

  return nextState
}

export default reducer
