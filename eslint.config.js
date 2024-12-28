import globals from "globals";
import pluginJs from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginPrettier from "eslint-plugin-prettier/recommended";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  { rules: { "prettier/prettier": ["error", { endOfLine: "auto" }] } },
  pluginJs.configs.recommended,
  eslintPluginPrettier,
  eslintConfigPrettier,
];
