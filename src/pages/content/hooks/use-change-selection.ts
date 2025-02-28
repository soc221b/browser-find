import { useLayoutEffect } from 'react'
import useStore from '../store'

export default function useChangeSelection() {
  const dispatch = useStore((state) => state.dispatch)

  useLayoutEffect(() => {
    changeSelection()

    window.addEventListener('click', changeSelection, true)

    return () => {
      window.removeEventListener('click', changeSelection, true)
    }

    function changeSelection() {
      const selection = document.getSelection()

      const focusNode = selection?.focusNode ?? document.body
      const focusOffset = selection?.focusOffset ?? 0

      if (document.querySelector('#browser-find-top-layer')?.contains(focusNode)) return

      dispatch({ type: 'ChangeSelection', selection: { focusNode, focusOffset } })
    }
  }, [])
}
