import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

let eslintConfig;
try {
  eslintConfig = [...compat.extends("next/core-web-vitals")];
} catch (error) {
  console.error("Error loading ESLint config:", error);
  eslintConfig = [];
}

eslintConfig = eslintConfig.map((config) => {
  if (config.parser && typeof config.parser.parse === "function") {
    delete config.parser.parse;
  }
  return config;
});

export default eslintConfig;
