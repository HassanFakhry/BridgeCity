import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,
    open: "/public/index.html",  // For local development
  },
  base: "/HassanClean/",  // Ensures correct asset paths on GitHub Pages
  publicDir: "public",  // Explicitly set the public folder
});
