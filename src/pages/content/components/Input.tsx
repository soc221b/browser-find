import { ChangeEventHandler, ClipboardEventHandler, useRef } from 'react'
import useStore from '../store'

export default function Input(): JSX.Element {
  const dispatch = useStore((store) => store.dispatch)
  const text = useStore((store) => store.text)
  const isPasting = useRef(false)

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    isPasting.current = true
    requestAnimationFrame(() => {
      isPasting.current = false
    })
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (isPasting.current) {
      dispatch({
        type: 'Type',
        value: event.target.value.trim().length
          ? event.target.value.trim()
          : ' ',
      })
    } else {
      dispatch({ type: 'Type', value: event.target.value })
    }
  }

  return (
    <input
      className="input"
      value={text}
      onChange={handleChange}
      onPaste={handlePaste}
      data-tooltip-content="Find"
    ></input>
  )
}
