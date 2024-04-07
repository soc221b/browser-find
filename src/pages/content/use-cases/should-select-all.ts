import { State } from '../state'
import { IsOSMacOS } from '../utils/ua'

type ShouldSelectAll = (_: { event: KeyboardEvent; state: Pick<State, 'focusing'>; isOSMacOS: IsOSMacOS }) => boolean

const shouldSelectAll: ShouldSelectAll = ({ event, state, isOSMacOS }) => {
  if (isOSMacOS()) {
    if (!event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'KeyF') {
      return true
    }
  } else {
    if (!event.altKey && event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'KeyF') {
      return true
    }
  }

  if (isOSMacOS()) {
    if (!event.altKey && !event.ctrlKey && event.metaKey && event.shiftKey && event.code === 'KeyG') {
      return true
    }

    if (!event.altKey && !event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'F3') {
      return true
    }
  } else {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'F3') {
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

export default shouldSelectAll
