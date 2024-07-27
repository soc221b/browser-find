import { IsOSMacOS } from '../utils/ua'
import { isPressing } from '../utils/is-pressing'

type ShouldOpen = (_: { event: KeyboardEvent; isOSMacOS: IsOSMacOS }) => boolean

const shouldOpen: ShouldOpen = ({ event, isOSMacOS }) => {
  if (isOSMacOS()) {
    if (isPressing({ event, code: 'KeyF', metaKey: true })) {
      return true
    }
  } else {
    if (isPressing({ event, code: 'KeyF', ctrlKey: true })) {
      return true
    }
  }

  return false
}

export default shouldOpen
