import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// `@algos` -> repo-root `src/`. The site imports the real algorithm functions
// from source (read-only); `src/` is never modified.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@algos": fileURLToPath(new URL("../src", import.meta.url)),
    },
  },
});
