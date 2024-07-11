import { useEffect } from 'react'
import { find } from '../use-cases/find'
import useStore from '../store'

export default function _Find(): JSX.Element {
  const store = useStore()

  useEffect(() => {
    store.dispatch({ type: 'ClearMatch' })
    store.dispatch({ type: 'ToggleFinding', value: true })

    const { stop } = find({
      documentElement: document.documentElement,
      text: store.text,
      shouldMatchCase: store.shouldMatchCase,
      shouldMatchWholeWord: store.shouldMatchWholeWord,
      shouldUseRegularExpression: store.shouldUseRegularExpression,
      onNext: (ranges) => {
        store.dispatch({
          type: 'Match',
          match: { id: Math.random().toString(36), ranges },
        })
      },
      onComplete: () => {
        store.dispatch({ type: 'ToggleFinding', value: false })
      },
    })

    return () => {
      stop()
    }
  }, [store.shouldMatchCase, store.shouldMatchWholeWord, store.shouldUseRegularExpression, store.text])

  return <></>
}
