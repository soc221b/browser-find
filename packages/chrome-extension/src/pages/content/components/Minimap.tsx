import { useEffect, useState } from "react";
import useStore from "../store";

export default function Minimap() {
  const found = useStore((state) => state.found);
  const [
    ticks,
    setTicks,
  ] = useState<number[]>([]);

  useEffect(() => {
    const calculateTicks = () => {
      requestAnimationFrame(() => {
        const pageHeight = document.documentElement.scrollHeight || 1;
        const viewportHeight = window.innerHeight;

        const newTicks = found.flatMap((match) =>
          match.ranges.map((range) => {
            const rect = range.getBoundingClientRect();
            const absoluteY = rect.top + window.scrollY;
            // Calculate percentage position
            const percentage = absoluteY / pageHeight;
            // Map to viewport height
            return percentage * viewportHeight;
          }),
        );
        setTicks(newTicks);
      });
    };

    calculateTicks();

    const handleResize = () => calculateTicks();
    window.addEventListener("resize", handleResize);

    // Observer for document height changes
    const observer = new ResizeObserver(calculateTicks);
    observer.observe(document.body);
    observer.observe(document.documentElement);

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [
    found,
  ]);

  if (found.length === 0) return null;

  return (
    <div
      aria-label="Minimap"
      role="complementary"
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "6px",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 2147483647, // Max z-index to be safe, or 9999 as per spec
      }}
    >
      {ticks.map((top, index) => (
        <div
          aria-label="Match location"
          key={index}
          style={{
            position: "absolute",
            top: `${top}px`,
            width: "6px",
            height: "6px",
            backgroundColor: "#FF9632",
            border: "1px solid rgba(0,0,0,0.1)",
            boxSizing: "border-box",
          }}
        />
      ))}
    </div>
  );
}
