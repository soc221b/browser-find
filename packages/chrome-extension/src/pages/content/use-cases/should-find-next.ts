import { State } from "../state";
import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldFindNext = (_: {
  event: KeyboardEvent;
  state: Pick<State, "focusing">;
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldFindNext: ShouldFindNext = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (isPressing({ event, code: "Enter" })) {
      return true;
    }
  }

  if (isOSMacOS()) {
    if (isPressing({ event, code: "KeyG", metaKey: true })) {
      return true;
    }

    if (isPressing({ event, code: "F3" })) {
      return true;
    }
  } else {
    if (isPressing({ event, code: "F3" })) {
      return true;
    }
  }

  return false;
};

export default shouldFindNext;
