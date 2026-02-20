import { State } from "../state";
import { isPressing } from "../utils/is-pressing";

type ShouldClose = (_: { event: KeyboardEvent; state: Pick<State, "focusing"> }) => boolean;

const shouldClose: ShouldClose = ({ event, state }) => {
  if (state.focusing) {
    if (isPressing({ event, code: "Escape" })) {
      return true;
    }

    if (isPressing({ event, code: "Escape", shiftKey: true })) {
      return true;
    }
  }

  return false;
};

export default shouldClose;
