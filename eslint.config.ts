import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  // import.meta.dirname is available after Node.js v20.11.0
  baseDirectory: import.meta.dirname,
});

const eslintConfig = [
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

  // Extend Next.js configs - order matters, next/typescript should come last
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
];

export default eslintConfig;
