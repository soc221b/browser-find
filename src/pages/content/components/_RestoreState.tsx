import { useEffect } from 'react'
import useStore from '../store'

export default function _RestoreSate(): JSX.Element {
  const store = useStore()
  useEffect(() => {
    chrome.storage.local.get(
      ['shouldMatchCase', 'shouldMatchWholeWord', 'shouldUseRegularExpression'],
      (persistedState) => {
        if (persistedState.shouldMatchCase !== undefined) {
          store.dispatch({
            type: 'ToggleShouldMatchCase',
            value: persistedState.shouldMatchCase,
          })
        }
        if (persistedState.shouldMatchWholeWord !== undefined) {
          store.dispatch({
            type: 'ToggleShouldMatchWholeWord',
            value: persistedState.shouldMatchWholeWord,
          })
        }
        if (persistedState.shouldUseRegularExpression !== undefined) {
          store.dispatch({
            type: 'ToggleShouldUseRegularExpression',
            value: persistedState.shouldUseRegularExpression,
          })
        }
      },
    )
  }, [])

  return <></>
}
