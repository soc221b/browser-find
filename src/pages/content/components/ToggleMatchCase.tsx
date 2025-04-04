import useStore from "../store";
import { isOSMacOS } from "../utils/ua";

export default function ToggleMatchCase(): React.JSX.Element {
  const shouldMatchCase = useStore((state) => state.shouldMatchCase);
  const dispatch = useStore((state) => state.dispatch);

  return (
    <button
      data-active={shouldMatchCase}
      onClick={() =>
        dispatch({
          type: "ToggleShouldMatchCase",
          value: !shouldMatchCase,
        })
      }
      className="icon"
      data-tooltip-content={
        isOSMacOS()
          ? "Match Case <kbd>Command</kbd>+<kbd>Option</kbd>+<kbd>C</kbd>"
          : "Match Case <kbd>Alt</kbd>+<kbd>C</kbd>"
      }
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24"
        viewBox="0 -960 960 960"
        width="24"
        fill="currentColor"
      >
        <path d="m159-280 150-400h72l150 400h-69l-36-102H264l-36 102h-69Zm126-160h120l-58-166h-4l-58 166Zm369 171q-49 0-77-25.5T549-364q0-42 32.5-68.5T665-459q23 0 42.5 3.5T741-444v-14q0-27-18.5-43T672-517q-21 0-39.5 9T601-482l-43-32q19-27 48-41t67-14q62 0 95 29.5t33 85.5v176h-59v-34h-3q-13 20-35 31.5T654-269Zm10-50q32 0 54.5-22.5T741-396q-14-8-32-12t-33-4q-32 0-49 12.5T610-364q0 20 15 32.5t39 12.5Z" />
      </svg>
    </button>
  );
}
