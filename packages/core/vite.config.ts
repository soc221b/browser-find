export default {
  build: {
    lib: {
      entry: "src/index.ts",
      formats: [
        "es",
      ],
    },
    outDir: "dist",
    sourcemap: true,
  },
};
