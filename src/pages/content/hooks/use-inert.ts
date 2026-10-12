import { useLayoutEffect, useRef, useState } from "react";
import { focusInput } from "../use-cases/focus-input";

export default function useInert(): boolean {
  const [
    inert,
    setInert,
  ] = useState(false);
  const wasInputFocused = useRef(false);
  useLayoutEffect(() => {
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };

    function handleFocus() {
      setInert(false);
      if (!wasInputFocused.current) return;
      setTimeout(() => {
        if (document.activeElement === document.body) focusInput();
      });
    }
  });
  useLayoutEffect(() => {
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("blur", handleBlur);
    };

    function handleBlur() {
      wasInputFocused.current = !!document.activeElement?.matches("#browser-find-top-layer .input");
      setInert(true);
    }
  });

  return inert;
}
