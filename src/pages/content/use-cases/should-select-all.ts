import { State } from '../state'
import { IsOSMacOS } from '../utils/ua'
import { isPressing } from '../utils/is-pressing'

type ShouldSelectAll = (_: { event: KeyboardEvent; state: Pick<State, 'focusing'>; isOSMacOS: IsOSMacOS }) => boolean

const shouldSelectAll: ShouldSelectAll = ({ event, state, isOSMacOS }) => {
  if (isOSMacOS()) {
    if (isPressing({ event, code: 'KeyF', metaKey: true })) {
      return true
    }
  } else {
    if (isPressing({ event, code: 'KeyF', ctrlKey: true })) {
      return true
    }
  }

  if (isOSMacOS()) {
    if (isPressing({ event, code: 'KeyG', metaKey: true, shiftKey: true })) {
      return true
    }

    if (isPressing({ event, code: 'F3', shiftKey: true })) {
      return true
    }
  } else {
    if (isPressing({ event, code: 'F3', shiftKey: true })) {
      return true
    }
  }

  if (isOSMacOS()) {
    if (isPressing({ event, code: 'KeyG', metaKey: true })) {
      return true
    }

    if (isPressing({ event, code: 'F3' })) {
      return true
    }
  } else {
    if (isPressing({ event, code: 'F3' })) {
      return true
    }
  }

  return false
}

export default shouldSelectAll
