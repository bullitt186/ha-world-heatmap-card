import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "src/world-heatmap-card.ts",
      formats: ["es"],
      fileName: () => "world-heatmap-card.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
