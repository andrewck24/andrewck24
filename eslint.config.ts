import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig([
  // Global ignores (only essential ones)
  {
    ignores: [
      ".next/**",
      "node_modules/**",
      ".source/**", // Fumadocs generated files
      "next-env.d.ts", // Next.js TypeScript environment file
      "jest.setup.ts", // Jest setup file
    ],
  },

  // Extend Next.js configs
  ...nextVitals,
  ...nextTs,
]);

export default eslintConfig;
