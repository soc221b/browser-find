import useStore from '../store'

export default function FindPrevious(): JSX.Element {
  const matches = useStore((state) => state.matches)
  const dispatch = useStore((state) => state.dispatch)

  return (
    <button
      disabled={!matches.length}
      onClick={() => dispatch({ type: 'FindPrevious' })}
      className="icon"
      data-tooltip-content="Previous Match <kbd>Shit</kbd>+<kbd>Enter</kbd>"
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24" fill="currentColor">
        <path d="m296-345-56-56 240-240 240 240-56 56-184-184-184 184Z" />
      </svg>
    </button>
  )
}
