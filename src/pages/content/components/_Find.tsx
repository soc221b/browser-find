import { useEffect } from 'react'
import { find } from '../use-cases/find'
import useStore from '../store'

let id = 0

export default function _Find(): JSX.Element {
  const dispatch = useStore((state) => state.dispatch)
  const shouldMatchCase = useStore((state) => state.shouldMatchCase)
  const shouldMatchWholeWord = useStore((state) => state.shouldMatchWholeWord)
  const shouldUseRegularExpression = useStore((state) => state.shouldUseRegularExpression)
  const text = useStore((state) => state.text)

  useEffect(() => {
    dispatch({ type: 'ClearMatch' })
    dispatch({ type: 'ToggleFinding', value: true })

    const { cancel } = find({
      documentElement: document.documentElement,
      text,
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
      onNext: (ranges) => {
        dispatch({
          type: 'Match',
          match: { id: id++, ranges },
        })
      },
      onComplete: () => {
        dispatch({ type: 'HighlightFollowing' })
        dispatch({ type: 'ToggleFinding', value: false })
      },
    })

    return () => {
      cancel()
    }
  }, [shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression, text])

  return <></>
}
