import { State } from "../state";
import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldToggleMatchWholeWord = (_: {
  event: KeyboardEvent;
  state: Pick<State, "focusing">;
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldToggleMatchWholeWord: ShouldToggleMatchWholeWord = ({ event, state, isOSMacOS }) => {
  if (state.focusing) {
    if (isOSMacOS()) {
      if (isPressing({ event, code: "KeyW", altKey: true, metaKey: true })) {
        return true;
      }
    } else {
      if (isPressing({ event, code: "KeyW", altKey: true })) {
        return true;
      }
    }
  }

  return false;
};

export default shouldToggleMatchWholeWord;
