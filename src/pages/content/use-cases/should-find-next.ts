import { State } from '../state'
import { IsOSMacOS } from '../utils/ua'

type ShouldFindNext = (_: { event: KeyboardEvent; state: Pick<State, 'focusing'>; isOSMacOS: IsOSMacOS }) => boolean

const shouldFindNext: ShouldFindNext = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'Enter') {
      return true
    }
  }

  if (isOSMacOS()) {
    if (!event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'KeyG') {
      return true
    }

    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'F3') {
      return true
    }
  } else {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'F3') {
      return true
    }
  }

  return false
}

export default shouldFindNext
