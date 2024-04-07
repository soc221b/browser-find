import { IsOSMacOS } from '../utils/ua'

type ShouldOpen = (_: { event: KeyboardEvent; isOSMacOS: IsOSMacOS }) => boolean

const shouldOpen: ShouldOpen = ({ event, isOSMacOS }) => {
  if (isOSMacOS()) {
    if (!event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'KeyF') {
      return true
    }
  } else {
    if (!event.altKey && event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'KeyF') {
      return true
    }
  }

  return false
}

export default shouldOpen
