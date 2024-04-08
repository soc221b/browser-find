import { useEffect } from 'react'
import { find } from '../use-cases/find'
import useStore from '../store'
import { highlights } from '../utils/highlights'

export default function _Find(): JSX.Element {
  const store = useStore()

  useEffect(() => {
    store.matches.forEach((match) => {
      match.ranges.forEach((range) => {
        highlights({ range, isAdd: false, isThis: true })
        highlights({ range, isAdd: false, isThis: false })
      })
    })
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

  useEffect(() => {
    if (store.finding) {
      return
    }

    store.matches.forEach((match) => {
      match.ranges.forEach((range, index) => {
        highlights({ range, isAdd: false, isThis: true })
        highlights({ range, isAdd: false, isThis: false })
        if (match.id === store.matchId) {
          highlights({ range, isAdd: true, isThis: true })
          if (index === 0) {
            range.startContainer.parentElement?.scrollIntoView({
              behavior: 'instant',
              block: 'nearest',
              inline: 'nearest',
            })
          }
        } else {
          highlights({ range, isAdd: true, isThis: false })
        }
      })
    })
  }, [store.finding, store.matches, store.matchId])

  return <></>
}
