import { ChangeEventHandler, ClipboardEventHandler, useRef } from 'react'
import useStore from '../store'

export default function Input(): React.JSX.Element {
  const dispatch = useStore((state) => state.dispatch)
  const text = useStore((state) => state.text)
  const isPasting = useRef(false)

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    isPasting.current = true
    requestAnimationFrame(() => {
      isPasting.current = false
    })
    event.stopPropagation()
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (isPasting.current) {
      dispatch({
        type: 'Input',
        value: event.target.value.trim().length ? event.target.value.trim() : ' ',
      })
    } else {
      dispatch({ type: 'Input', value: event.target.value })
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
