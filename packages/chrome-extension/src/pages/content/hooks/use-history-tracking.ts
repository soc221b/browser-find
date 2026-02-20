import { useEffect, useRef } from "react";
import useStore from "../store";

export default function useHistoryTracking() {
  const text = useStore((state) => state.text);
  const dispatch = useStore((state) => state.dispatch);
  const lastTextRef = useRef(text);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const lastText = lastTextRef.current;
    if (text === lastText) return;

    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const isWordBoundary = (char: string) => /\s|[.,!?;:]/.test(char);

    const diff = text.length - lastText.length;
    const addedCharAtEnd = diff === 1 ? text[text.length - 1] : null;

    const shouldCommitImmediately =
      (addedCharAtEnd && isWordBoundary(addedCharAtEnd)) || Math.abs(diff) > 1;

    if (shouldCommitImmediately) {
      dispatch({ type: "CommitHistory" });
    } else {
      timerRef.current = setTimeout(() => {
        dispatch({ type: "CommitHistory" });
      }, 500);
    }

    lastTextRef.current = text;

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [
    text,
    dispatch,
  ]);
}
