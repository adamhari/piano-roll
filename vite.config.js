import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  assetsInclude: "**/*.TTF",
  base: "/piano-roll/",
  plugins: [react()],
});
