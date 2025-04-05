import { State } from "../state";
import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldToggleMatchCase = (_: {
  event: KeyboardEvent;
  state: Pick<State, "focusing">;
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldToggleMatchCase: ShouldToggleMatchCase = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (isOSMacOS()) {
      if (isPressing({ event, code: "KeyC", altKey: true, metaKey: true })) {
        return true;
      }
    } else {
      if (isPressing({ event, code: "KeyC", altKey: true })) {
        return true;
      }
    }
  }

  return false;
};

export default shouldToggleMatchCase;
