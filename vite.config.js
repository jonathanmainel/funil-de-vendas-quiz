import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { cloudflare } from "@cloudflare/vite-plugin";
import { sites } from "@openai/sites-vite-plugin";

export default defineConfig(({ mode }) => {
  const isTest = mode === "test";

  return {
    plugins: [
      react(),
      !isTest && sites(),
      !isTest &&
        cloudflare({
          config: {
            main: "./worker/index.js",
            compatibility_date: "2026-08-19",
          },
        }),
    ].filter(Boolean),
  server: {
    port: 4173,
  },
  preview: {
    port: 4173,
  },
  };
});
