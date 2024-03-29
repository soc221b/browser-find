import { useEffect } from 'react'
import find from '../use-cases/find'
import useStore from '../store'

export default function _Find(): JSX.Element {
  const dispatch = useStore((state) => state.dispatch)

  const open = useStore((state) => state.open)
  const shouldMatchCase = useStore((state) => state.shouldMatchCase)
  const shouldMatchWholeWord = useStore((state) => state.shouldMatchWholeWord)
  const shouldUseRegularExpression = useStore(
    (state) => state.shouldUseRegularExpression,
  )
  const text = useStore((state) => state.text)
  useEffect(() => {
    if (open === false) {
      return
    }

    const cancel = find({
      onMatch: (match) =>
        dispatch({
          type: 'Match',
          match,
        }),
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
      text,
    })

    return () => {
      cancel()
    }
  }, [shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression, text])

  return <></>
}
