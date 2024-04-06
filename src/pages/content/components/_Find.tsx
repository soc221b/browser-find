import { useEffect } from 'react'
import { find } from '../use-cases/find'
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

    CSS.highlights.set('browser-find-match', new Highlight())
    CSS.highlights.set('browser-find', new Highlight())

    const { stop } = find({
      documentElement: document.documentElement,
      text,
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
      onNext: (ranges) => {
        dispatch({
          type: 'Match',
          match: { id: Math.random().toString(36), ranges },
        })
      },
      onComplete: () => {},
    })

    return () => {
      stop()
    }
  }, [shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression, text])

  return <></>
}
