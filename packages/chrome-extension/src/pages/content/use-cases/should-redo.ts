import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldRedo = (_: {
  event: KeyboardEvent;
  state: { focusing: boolean };
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldRedo: ShouldRedo = ({ event, state, isOSMacOS }) => {
  if (!state.focusing) return false;

  if (isOSMacOS()) {
    return isPressing({ event, code: "KeyZ", metaKey: true, shiftKey: true });
  } else {
    if (isPressing({ event, code: "KeyZ", ctrlKey: true, shiftKey: true })) return true;
    if (isPressing({ event, code: "KeyY", ctrlKey: true })) return true;
    return false;
  }
};

export default shouldRedo;
