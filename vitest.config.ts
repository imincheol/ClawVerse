import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      include: ["src/lib/**/*.ts", "src/data/**/*.ts"],
      exclude: [
        "src/**/*.test.ts",
        "src/test/**",
        "src/lib/integrations/**",
        "src/lib/supabase/**",
        "src/lib/data/pulse.ts",
        "src/lib/data/submissions.ts",
        "src/data/pulse.ts",
        "src/data/owasp.ts",
      ],
      thresholds: {
        statements: 55,
        branches: 30,
        functions: 65,
        lines: 58,
      },
    },
  },
});
