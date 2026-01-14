import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldUndo = (_: {
  event: KeyboardEvent;
  state: { focusing: boolean };
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldUndo: ShouldUndo = ({ event, state, isOSMacOS }) => {
  if (!state.focusing) return false;

  if (isOSMacOS()) {
    return isPressing({ event, code: "KeyZ", metaKey: true });
  } else {
    return isPressing({ event, code: "KeyZ", ctrlKey: true });
  }
};

export default shouldUndo;
