import { State } from '../state'
import { IsOSMacOS } from '../utils/ua'

type ShouldStopPropagationKeyDown = (_: {
  event: KeyboardEvent
  state: Pick<State, 'focusing'>
  isOSMacOS: IsOSMacOS
}) => boolean

const shouldStopPropagationKeyDown: ShouldStopPropagationKeyDown = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (isOSMacOS()) {
      if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'Backspace') {
        return true
      }
      if (!event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'Backspace') {
        return true
      }
      if (!event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'KeyZ') {
        return true
      }
      if (!event.altKey && !event.ctrlKey && event.metaKey && event.shiftKey && event.code === 'KeyZ') {
        return true
      }
      if (!event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'ArrowLeft') {
        return true
      }
      if (!event.altKey && !event.ctrlKey && event.metaKey && event.shiftKey && event.code === 'ArrowLeft') {
        return true
      }
      if (!event.altKey && !event.ctrlKey && event.metaKey && !event.shiftKey && event.code === 'ArrowRight') {
        return true
      }
      if (!event.altKey && !event.ctrlKey && event.metaKey && event.shiftKey && event.code === 'ArrowRight') {
        return true
      }
      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'ArrowLeft') {
        return true
      }
      if (event.altKey && !event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'ArrowLeft') {
        return true
      }
      if (event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'ArrowRight') {
        return true
      }
      if (event.altKey && !event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'ArrowRight') {
        return true
      }
    } else {
      if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'Backspace') {
        return true
      }
      if (!event.altKey && event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'Backspace') {
        return true
      }
      if (!event.altKey && event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'KeyZ') {
        return true
      }
      if (!event.altKey && event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'KeyZ') {
        return true
      }
      if (!event.altKey && event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'ArrowLeft') {
        return true
      }
      if (!event.altKey && event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'ArrowLeft') {
        return true
      }
      if (!event.altKey && event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'ArrowRight') {
        return true
      }
      if (!event.altKey && event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'ArrowRight') {
        return true
      }
    }
  }

  return false
}

export default shouldStopPropagationKeyDown
