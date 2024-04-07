import { MouseEventHandler } from 'react'
import useStore from '../store'

export default function Result(): JSX.Element {
  const text = useStore((selector) => selector.text)
  const matchId = useStore((selector) => selector.matchId)
  const matches = useStore((selector) => selector.matches)

  const index = matches.findIndex((match) => match.id === matchId) + 1
  const total = matches.length

  const handleClick: MouseEventHandler<HTMLDivElement> = () => {
    document.querySelector<HTMLInputElement>('#browser-find-top-layer .input')?.focus()
  }

  return text ? (
    <div onClick={handleClick} className="result">
      {`${index}/${total}`}
    </div>
  ) : (
    <></>
  )
}
