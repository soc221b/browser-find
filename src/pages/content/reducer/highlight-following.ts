import { Action } from '../action'
import { State } from '../state'
import { highlights } from '../utils/highlights'

type Reducer = (state: State, action: Action & { type: 'HighlightFollowing' }) => State

const reducer: Reducer = (state) => {
  const nextState = {
    ...state,
  }

  if (state.matches.length === 0) {
    return nextState
  }

  const activeElement = state.selection
  if (activeElement === null) {
    nextState.matchId = state.matches[0].id
    return nextState
  }

  let first = 0
  let last = state.matches.length - 1
  while (first < last) {
    const mid = first + Math.floor((last - first) / 2)
    const match = state.matches[mid]
    const range = match.ranges[0]
    const startContainer = range.startContainer
    if (activeElement.compareDocumentPosition(startContainer) & Node.DOCUMENT_POSITION_PRECEDING) {
      first = mid + 1
    } else {
      last = mid
    }
  }
  const match = state.matches[first]
  nextState.matchId = match.id
  match.ranges[0].startContainer.parentElement?.scrollIntoView({
    behavior: 'instant',
    block: 'nearest',
    inline: 'nearest',
  })
  match.ranges.forEach((range) => {
    highlights({ range, isAdd: true, isThis: true })
  })
  return nextState
}

export default reducer
