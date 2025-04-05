import { useEffect, useLayoutEffect } from 'react'
import { isOSMacOS } from '../utils/ua'
import useStore from '../store'
import shouldOpen from '../use-cases/should-open'
import shouldClose from '../use-cases/should-close'
import shouldFindNext from '../use-cases/should-find-next'
import shouldFindPrevious from '../use-cases/should-find-previous'
import shouldToggleMatchCase from '../use-cases/should-toggle-match-case'
import shouldToggleMatchWholeWord from '../use-cases/should-toggle-match-whole-word'
import shouldToggleUseRegularExpression from '../use-cases/should-toggle-use-regular-expression'
import shouldSelectAll from '../use-cases/should-select-all'
import shouldStopPropagationKeyDown from '../use-cases/should-trap-key-down'
import { focusInput } from '../use-cases/focus-input'
import { selectInput } from '../use-cases/select-input'

export default function _HotKey(): React.JSX.Element {
  const dispatch = useStore((state) => state.dispatch)
  const open = useStore((state) => state.open)
  const shouldMatchCase = useStore((state) => state.shouldMatchCase)
  const shouldMatchWholeWord = useStore((state) => state.shouldMatchWholeWord)
  const shouldUseRegularExpression = useStore((state) => state.shouldUseRegularExpression)
  const focusing = useStore((state) => state.focusing)

  if (open) {
    ;(document.querySelector('#browser-find-top-layer') as any)?.showPopover()
  } else {
    ;(document.querySelector('#browser-find-top-layer') as any)?.hidePopover()
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown)
    return () => {
      window.removeEventListener('keydown', handleKeydown)
    }

    function handleKeydown(event: KeyboardEvent) {
      const state = { dispatch, focusing, shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression }
      if (shouldOpen({ event, isOSMacOS })) {
        event.preventDefault()
        state.dispatch({ type: 'Show' })
        focusInput()
        if (shouldSelectAll({ event, state, isOSMacOS })) {
          selectInput()
        }
        return
      }

      if (shouldClose({ event, state })) {
        event.preventDefault()
        state.dispatch({ type: 'Close' })
        return
      }

      if (shouldFindNext({ event, state, isOSMacOS })) {
        event.preventDefault()
        state.dispatch({ type: 'FindNext' })
        focusInput()
        if (shouldSelectAll({ event, state, isOSMacOS })) {
          selectInput()
        }
        return
      }

      if (shouldFindPrevious({ event, state, isOSMacOS })) {
        event.preventDefault()
        state.dispatch({ type: 'FindPrevious' })
        focusInput()
        if (shouldSelectAll({ event, state, isOSMacOS })) {
          selectInput()
        }
        return
      }

      if (
        shouldToggleMatchCase({
          event,
          state,
          isOSMacOS,
        })
      ) {
        event.preventDefault()
        state.dispatch({
          type: 'ToggleShouldMatchCase',
          value: !state.shouldMatchCase,
        })
        return
      }

      if (
        shouldToggleMatchWholeWord({
          event,
          state,
          isOSMacOS,
        })
      ) {
        event.preventDefault()
        state.dispatch({
          type: 'ToggleShouldMatchWholeWord',
          value: !state.shouldMatchWholeWord,
        })
        return
      }

      if (
        shouldToggleUseRegularExpression({
          event,
          state,
          isOSMacOS,
        })
      ) {
        event.preventDefault()
        state.dispatch({
          type: 'ToggleShouldUseRegularExpression',
          value: !state.shouldUseRegularExpression,
        })
        return
      }
    }
  }, [focusing, shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression])
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown, { capture: true })
    return () => {
      window.removeEventListener('keydown', handleKeydown, { capture: true })
    }

    function handleKeydown(event: KeyboardEvent) {
      if (
        shouldStopPropagationKeyDown({
          event,
          state: { focusing },
          isOSMacOS,
        })
      ) {
        event.stopImmediatePropagation()
        return
      }
    }
  }, [focusing])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseup)
    return () => {
      window.removeEventListener('mouseup', handleMouseup)
    }

    function handleMouseup(event: MouseEvent) {
      const topLayer = document.querySelector('#browser-find-top-layer')
      const value = event.target instanceof Node && !!topLayer?.contains(event.target)
      if (focusing === value) return

      if (value) {
        dispatch({ type: 'Focus' })
      } else {
        dispatch({ type: 'Blur' })
      }
    }
  }, [focusing])
  useLayoutEffect(() => {
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }

    function handleFocus() {
      const topLayer = document.querySelector('#browser-find-top-layer')
      const value = document.activeElement instanceof Node && !!topLayer?.contains(document.activeElement)
      if (focusing === value) return

      if (value) {
        dispatch({ type: 'Focus' })
      } else {
        dispatch({ type: 'Blur' })
      }
    }
  }, [])

  return <></>
}
