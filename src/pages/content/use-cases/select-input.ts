export const selectInput = () => {
  setTimeout(() => {
    const inputElement = document.querySelector("#browser-find-top-layer .input");
    if (inputElement instanceof HTMLInputElement) {
      inputElement.select();
    }
  });
};
