import { useLayoutEffect, useState } from "react";

export default function useInert(): boolean {
  const [
    inert,
    setInert,
  ] = useState(false);
  useLayoutEffect(() => {
    window.addEventListener("focus", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
    };

    function handleFocus() {
      setInert(false);
    }
  });
  useLayoutEffect(() => {
    window.addEventListener("blur", handleBlur);
    return () => {
      window.removeEventListener("blur", handleBlur);
    };

    function handleBlur() {
      setInert(true);
    }
  });

  return inert;
}
