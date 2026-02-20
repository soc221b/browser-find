import { State } from "../state";
import { isPressing } from "../utils/is-pressing";
import { IsOSMacOS } from "../utils/ua";

type ShouldStopPropagationKeyDown = (_: {
  event: KeyboardEvent;
  state: Pick<State, "focusing">;
  isOSMacOS: IsOSMacOS;
}) => boolean;

const shouldStopPropagationKeyDown: ShouldStopPropagationKeyDown = ({
  event,
  state,
  isOSMacOS,
}) => {
  if (state.focusing) {
    if (isOSMacOS()) {
      if (isPressing({ event, code: "Backspace" })) {
        return true;
      }
      if (isPressing({ event, code: "Backspace", metaKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "KeyZ", metaKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "KeyZ", metaKey: true, shiftKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowLeft", metaKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowLeft", metaKey: true, shiftKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowRight", metaKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowRight", metaKey: true, shiftKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowLeft", altKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowLeft", altKey: true, shiftKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowRight", altKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowRight", altKey: true, shiftKey: true })) {
        return true;
      }
    } else {
      if (isPressing({ event, code: "Backspace" })) {
        return true;
      }
      if (isPressing({ event, code: "Backspace", ctrlKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "KeyZ", ctrlKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "KeyZ", ctrlKey: true, shiftKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "KeyY", ctrlKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowLeft", ctrlKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowLeft", ctrlKey: true, shiftKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowRight", ctrlKey: true })) {
        return true;
      }
      if (isPressing({ event, code: "ArrowRight", ctrlKey: true, shiftKey: true })) {
        return true;
      }
    }
  }

  return false;
};

export default shouldStopPropagationKeyDown;
