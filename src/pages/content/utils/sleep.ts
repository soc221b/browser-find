type Sleep = (_: "raf" | number) => Promise<void>;

const sleep: Sleep = async (msOrRaf) => {
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

export default sleep;
