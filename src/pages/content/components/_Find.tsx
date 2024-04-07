import { useEffect, useState } from 'react'
import { find } from '../use-cases/find'
import useStore from '../store'
import { highlights } from '../utils/highlights'

export default function _Find(): JSX.Element {
  const dispatch = useStore((state) => state.dispatch)
  const open = useStore((state) => state.open)
  const shouldMatchCase = useStore((state) => state.shouldMatchCase)
  const shouldMatchWholeWord = useStore((state) => state.shouldMatchWholeWord)
  const shouldUseRegularExpression = useStore((state) => state.shouldUseRegularExpression)
  const text = useStore((state) => state.text)
  const matches = useStore((state) => state.matches)
  const matchId = useStore((state) => state.matchId)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    matches.forEach((match) => {
      match.ranges.forEach((range) => {
        highlights({ range, isAdd: false, isThis: true })
        highlights({ range, isAdd: false, isThis: false })
      })
    })
    dispatch({ type: 'ClearMatch' })
  }, [shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression, text])

  useEffect(() => {
    if (open === false) {
      return
    }

    setIsCompleted(false)
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
      onComplete: () => {
        setIsCompleted(true)
      },
    })

    return () => {
      stop()
    }
  }, [shouldMatchCase, shouldMatchWholeWord, shouldUseRegularExpression, text])

  useEffect(() => {
    if (isCompleted === false) {
      return
    }

    matches.forEach((match) => {
      match.ranges.forEach((range, index) => {
        highlights({ range, isAdd: false, isThis: true })
        highlights({ range, isAdd: false, isThis: false })
        if (match.id === matchId) {
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
  }, [isCompleted, matches, matchId])

  return <></>
}
