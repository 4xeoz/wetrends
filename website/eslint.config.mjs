import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // TypeScript - warn on common issues, allow any for gradual migration
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-empty-interface": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",

      // React - enforce key rules
      "react/no-unescaped-entities": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/display-name": "warn",
      "react/jsx-key": "error",
      "react/jsx-no-target-blank": "error",

      // Accessibility - enforce important rules
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-is-valid": "warn",

      // General
      "no-console": ["warn", { "allow": ["error"] }],
      "no-debugger": "error",
      "no-unused-vars": "off",
      "prefer-const": "warn",
      "no-var": "error",
    },
  },
];

export default eslintConfig;
