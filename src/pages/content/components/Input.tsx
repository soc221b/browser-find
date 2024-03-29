import { ChangeEventHandler } from 'react'
import useStore from '../store'

export default function Input(): JSX.Element {
  const dispatch = useStore((store) => store.dispatch)
  const text = useStore((store) => store.text)

  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    dispatch({ type: 'Type', value: event.target.value })
  }

  return (
    <input
      className="input"
      value={text}
      onChange={handleChange}
      data-tooltip-content="Find"
    ></input>
  )
}
