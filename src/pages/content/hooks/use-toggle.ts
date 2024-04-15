import { useState } from 'react'

export default function useToggle(initialState?: boolean) {
  const [state, setState] = useState(initialState ?? false)
  const toggleState = () => {
    setState(!state)
  }

  return [state, toggleState] as const
}
