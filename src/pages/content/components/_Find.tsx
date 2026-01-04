import { useEffect, useState } from "react";
import useStore from "../store";
import { find } from "../use-cases/find";

let id = 0;

export default function _Find(): React.JSX.Element {
  const dispatch = useStore((state) => state.dispatch);
  const shouldMatchCase = useStore((state) => state.shouldMatchCase);
  const shouldMatchWholeWord = useStore((state) => state.shouldMatchWholeWord);
  const shouldUseRegularExpression = useStore((state) => state.shouldUseRegularExpression);
  const text = useStore((state) => state.text);
  const [
    version,
    setVersion,
  ] = useState(0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new MutationObserver((mutations) => {
      const hasExternalMutation = mutations.some((mutation) => {
        let node: Node | null = mutation.target;
        while (node) {
          if (node instanceof HTMLElement && node.id === "browser-find-top-layer") {
            return false;
          }
          node = node.parentNode;
        }
        return true;
      });

      if (hasExternalMutation) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setVersion((v) => v + 1);
        }, 300);
      }
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    return () => {
      observer.disconnect();
      clearTimeout(timeoutId);
    };
  }, []);

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
    version,
  ]);

  return <></>;
}
