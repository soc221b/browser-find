import { State } from "../state";
import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldToggleUseRegularExpression = (_: {
  event: KeyboardEvent;
  state: Pick<State, "focusing">;
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldToggleUseRegularExpression: ShouldToggleUseRegularExpression = ({
  event,
  state,
  isOSMacOS,
}) => {
  if (state.focusing) {
    if (isOSMacOS()) {
      if (isPressing({ event, code: "KeyR", altKey: true, metaKey: true })) {
        return true;
      }
    } else {
      if (isPressing({ event, code: "KeyR", altKey: true })) {
        return true;
      }
    }
  }

  return false;
};

export default shouldToggleUseRegularExpression;
