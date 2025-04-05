import useStore from '../store'

export default function Close(): React.JSX.Element {
  const dispatch = useStore((state) => state.dispatch)

  return (
    <button onClick={() => dispatch({ type: 'Close' })} className="icon" data-tooltip-content="Close <kbd>Escape</kbd>">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
        style={{ scale: '75%' }}
      >
        <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
      </svg>
    </button>
  )
}
