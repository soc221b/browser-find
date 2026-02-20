export type Sleep = (_: "raf" | number) => Promise<void>;

export const sleep: Sleep = async (msOrRaf) => {
  return new Promise((resolve) => {
    if (msOrRaf === "raf") {
      requestAnimationFrame(() => {
        resolve();
      });
    } else {
      setTimeout(() => resolve(), msOrRaf);
    }
  });
};
