import { ChangeEventHandler, ClipboardEventHandler } from 'react'
import useStore from '../store'

export default function Input(): JSX.Element {
  const dispatch = useStore((store) => store.dispatch)
  const text = useStore((store) => store.text)

  const handlePaste: ClipboardEventHandler<HTMLInputElement> = (event) => {
    requestAnimationFrame(() => {
      dispatch({
        type: 'Type',
        value: (event.target as HTMLInputElement).value.trim(),
      })
    })
  }

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({ type: 'Type', value: event.target.value })
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
