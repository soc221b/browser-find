import { State } from '../state'

type ShouldClose = (_: { event: KeyboardEvent; state: Pick<State, 'focusing'> }) => boolean

const shouldClose: ShouldClose = ({ event, state }) => {
  if (state.focusing) {
    if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey && event.code === 'Escape') {
      return true
    }

    if (!event.altKey && !event.ctrlKey && !event.metaKey && event.shiftKey && event.code === 'Escape') {
      return true
    }
  }

  return false
}

export default shouldClose
