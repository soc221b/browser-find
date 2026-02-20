import { State } from "../state";
import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldFindPrevious = (_: {
  event: KeyboardEvent;
  state: Pick<State, "focusing">;
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldFindPrevious: ShouldFindPrevious = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (isPressing({ event, code: "Enter", shiftKey: true })) {
      return true;
    }
  }

  if (isOSMacOS()) {
    if (isPressing({ event, code: "KeyG", metaKey: true, shiftKey: true })) {
      return true;
    }

    if (isPressing({ event, code: "F3", shiftKey: true })) {
      return true;
    }
  } else {
    if (isPressing({ event, code: "F3", shiftKey: true })) {
      return true;
    }
  }

  return false;
};

export default shouldFindPrevious;
