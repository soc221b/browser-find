import { useEffect } from "react";
import { Restore } from "../action/restore";
import useStore from "../store";

export default function useTabState() {
  const dispatch = useStore((state) => state.dispatch);

  useEffect(() => {
    let isTouched = false;

    load();
    window.addEventListener("pageshow", handlePageShow);
    const unsubscribe = useStore.subscribe((state, prevState) => {
      const value: Restore["value"] = {
        text: state.text,
        shouldMatchCase: state.shouldMatchCase,
        shouldMatchWholeWord: state.shouldMatchWholeWord,
        shouldUseRegularExpression: state.shouldUseRegularExpression,
        history: state.history,
        historyIndex: state.historyIndex,
        lastCommittedText: state.lastCommittedText,
      };
      const isChanged = (Object.keys(value) as (keyof Restore["value"])[]).some(
        (key) => state[key] !== prevState[key],
      );
      if (!isChanged) return;
      isTouched = true;
      sendMessage({ type: "Save", value });
    });

    return () => {
      window.removeEventListener("pageshow", handlePageShow);
      unsubscribe();
    };

    function load() {
      isTouched = false;
      sendMessage({ type: "Load" }).then((value?: Restore["value"]) => {
        if (value && !isTouched) dispatch({ type: "Restore", value });
      });
    }

    function handlePageShow(event: PageTransitionEvent) {
      if (!event.persisted) return;
      dispatch({ type: "Close" });
      load();
    }
  }, [
    dispatch,
  ]);
}

function sendMessage(message: { type: "Load" } | { type: "Save"; value: Restore["value"] }) {
  if (!chrome.runtime?.id) return Promise.resolve();
  return chrome.runtime.sendMessage(message).catch(() => {});
}
