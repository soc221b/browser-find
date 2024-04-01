import useStore from '../store'

export default function FindNext(): JSX.Element {
  const matches = useStore((state) => state.matches)
  const dispatch = useStore((state) => state.dispatch)

  return (
    <button
      disabled={!matches.length}
      onClick={() => dispatch({ type: 'FindNext' })}
      className="icon"
      data-tooltip-content="Next Match <kbd>Enter</kbd>"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
      >
        <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
      </svg>
    </button>
  )
}
