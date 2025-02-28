import { useLayoutEffect } from 'react'
import useStore from '../store'

export default function useChangeFocusNode() {
  const dispatch = useStore((state) => state.dispatch)

  useLayoutEffect(() => {
    changeFocusNode()

    window.addEventListener('click', changeFocusNode, true)

    return () => {
      window.removeEventListener('click', changeFocusNode, true)
    }

    function changeFocusNode() {
      const focusNode = document.getSelection()?.focusNode ?? null

      if (document.querySelector('#browser-find-top-layer')?.contains(focusNode)) return

      dispatch({ type: 'ChangeFocusNode', focusNode: focusNode })
    }
  }, [])
}
