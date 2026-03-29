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
      // TypeScript - Allow all
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/no-unnecessary-type-constraint": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      
      // React - Allow all
      "react/no-unescaped-entities": "off",
      "react-hooks/rules-of-hooks": "off",
      "react-hooks/exhaustive-deps": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      "react/jsx-key": "off",
      "react/jsx-no-target-blank": "off",
      
      // Accessibility - Allow all
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/interactive-supports-focus": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      "jsx-a11y/no-noninteractive-element-interactions": "off",
      
      // General - Allow all
      "no-console": "off",
      "no-debugger": "off",
      "no-unused-vars": "off",
      "no-undef": "off",
      "no-empty": "off",
      "no-var": "off",
      "prefer-const": "off",
    },
  },
];

export default eslintConfig;
