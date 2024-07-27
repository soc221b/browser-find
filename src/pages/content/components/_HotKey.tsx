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

export default function _HotKey(): JSX.Element {
  const state = useStore()

  if (state.open) {
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
      if (shouldOpen({ event, isOSMacOS })) {
        event.preventDefault()
        state.dispatch({ type: 'ToggleOpen', value: true })
        focusInput()
        if (shouldSelectAll({ event, state, isOSMacOS })) {
          selectInput()
        }
        return
      }

      if (shouldClose({ event, state })) {
        event.preventDefault()
        state.dispatch({ type: 'ToggleOpen', value: false })
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
  }, [state])
  useEffect(() => {
    window.addEventListener('keydown', handleKeydown, { capture: true })
    return () => {
      window.removeEventListener('keydown', handleKeydown, { capture: true })
    }

    function handleKeydown(event: KeyboardEvent) {
      if (
        shouldStopPropagationKeyDown({
          event,
          state,
          isOSMacOS,
        })
      ) {
        event.stopImmediatePropagation()
        return
      }
    }
  }, [state])

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseup)
    return () => {
      window.removeEventListener('mouseup', handleMouseup)
    }

    function handleMouseup(event: MouseEvent) {
      const topLayer = document.querySelector('#browser-find-top-layer')
      const value = event.target instanceof Node && !!topLayer?.contains(event.target)
      if (state.focusing === value) return

      state.dispatch({ type: 'ToggleFocus', value })
    }
  }, [state])
  useLayoutEffect(() => {
    window.addEventListener('focus', handleFocus)
    return () => {
      window.removeEventListener('focus', handleFocus)
    }

    function handleFocus() {
      const topLayer = document.querySelector('#browser-find-top-layer')
      const value = document.activeElement instanceof Node && !!topLayer?.contains(document.activeElement)
      if (state.focusing === value) return

      state.dispatch({ type: 'ToggleFocus', value })
    }
  }, [])

  return <></>
}
