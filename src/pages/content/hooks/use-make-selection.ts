import { useLayoutEffect } from 'react'
import useStore from '../store'

export default function useMakeSelection() {
  const dispatch = useStore((state) => state.dispatch)

  useLayoutEffect(() => {
    makeSelection()

    window.addEventListener('click', makeSelection, true)

    return () => {
      window.removeEventListener('click', makeSelection, true)
    }

    function makeSelection() {
      const selection = document.getSelection()

      const focusNode = selection?.focusNode ?? document.body
      const focusOffset = selection?.focusOffset ?? 0

      if (document.querySelector('#browser-find-top-layer')?.contains(focusNode)) return

      dispatch({ type: 'MakeSelection', value: { focusNode, focusOffset } })
    }
  }, [])
}
