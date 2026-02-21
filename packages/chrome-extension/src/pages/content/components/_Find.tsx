import { useEffect } from "react";
import useStore from "../store";
import { createRegex, find } from "@browser-find/core";
import sleep from "../utils/sleep";

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

    const regex = createRegex({
      text,
      shouldMatchCase,
      shouldMatchWholeWord,
      shouldUseRegularExpression,
    });

    const iterator = find({
      element: document.documentElement,
      regex,
    });

    let isCancelled = false;
    void (async () => {
      await sleep("raf");

      while (!isCancelled) {
        const result = iterator.next();
        if (result.done) {
          dispatch({ type: "Complete" });
          return;
        }

        dispatch({
          type: "Next",
          value: { id: id++, ranges: result.value },
        });

        await sleep("raf");
      }
    })();

    return () => {
      isCancelled = true;
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
