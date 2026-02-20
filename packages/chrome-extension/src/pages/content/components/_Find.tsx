import { useEffect } from "react";
import useStore from "../store";
import { find } from "../use-cases/find";

let id = 0;

export default function _Find(): React.JSX.Element {
  const dispatch = useStore((state) => state.dispatch);
  const shouldMatchCase = useStore((state) => state.shouldMatchCase);
  const shouldMatchWholeWord = useStore((state) => state.shouldMatchWholeWord);
  const shouldUseRegularExpression = useStore((state) => state.shouldUseRegularExpression);
  const text = useStore((state) => state.text);
  const searchVersion = useStore((state) => state.searchVersion);

  useEffect(() => {
    dispatch({ type: "Subscribe" });

    const { cancel } = find({
      documentElement: document.documentElement,
      text,
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
      onNext: (ranges) => {
        dispatch({
          type: "Next",
          value: { id: id++, ranges },
        });
      },
      onComplete: () => {
        dispatch({ type: "Complete" });
      },
    });

    return () => {
      cancel();
    };
  }, [
    shouldMatchCase,
    shouldMatchWholeWord,
    shouldUseRegularExpression,
    text,
    searchVersion,
  ]);

  return <></>;
}
