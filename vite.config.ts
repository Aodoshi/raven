import path from "path";
import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    tailwindcss(),
  ],
  resolve: {
    alias: [
      { find: "@/app", replacement: path.resolve(__dirname, "src/app") },
      {
        find: "@/entities",
        replacement: path.resolve(__dirname, "src/entities"),
      },
      {
        find: "@/features",
        replacement: path.resolve(__dirname, "src/features"),
      },
      { find: "@/pages", replacement: path.resolve(__dirname, "src/pages") },
      { find: "@/shared", replacement: path.resolve(__dirname, "src/shared") },
      {
        find: "@/widgets",
        replacement: path.resolve(__dirname, "src/widgets"),
      },
      { find: "@", replacement: path.resolve(__dirname, "src") },
      {
        find: "components",
        replacement: path.resolve(__dirname, "src/shared/ui"),
      },
      { find: "ui", replacement: path.resolve(__dirname, "src/shared/ui") },
      { find: "lib", replacement: path.resolve(__dirname, "src/shared/lib") },
      {
        find: "utils",
        replacement: path.resolve(__dirname, "src/shared/lib/utils"),
      },
      { find: "hooks", replacement: path.resolve(__dirname, "src/hooks") },
    ],
  },
});
