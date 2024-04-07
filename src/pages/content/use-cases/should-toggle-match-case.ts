import { State } from '../state'
import { IsOSMacOS } from '../utils/ua'

type ShouldToggleMatchCase = (_: {
  event: KeyboardEvent
  state: Pick<State, 'focusing'>
  isOSMacOS: IsOSMacOS
}) => boolean

const shouldToggleMatchCase: ShouldToggleMatchCase = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (isOSMacOS()) {
      if (event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'KeyC') {
        return true
      }
    } else {
      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'KeyC') {
        return true
      }
    }
  }

  return false
}

export default shouldToggleMatchCase
