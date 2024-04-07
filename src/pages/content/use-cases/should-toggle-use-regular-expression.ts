import { State } from '../state'
import { IsOSMacOS } from '../utils/ua'

type ShouldToggleUseRegularExpression = (_: {
  event: KeyboardEvent
  state: Pick<State, 'focusing'>
  isOSMacOS: IsOSMacOS
}) => boolean

const shouldToggleUseRegularExpression: ShouldToggleUseRegularExpression = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (isOSMacOS()) {
      if (event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'KeyR') {
        return true
      }
    } else {
      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'KeyR') {
        return true
      }
    }
  }

  return false
}

export default shouldToggleUseRegularExpression
