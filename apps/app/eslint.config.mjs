import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
const eslintConfig = [...nextCoreWebVitals, ...nextTypescript, {
  rules: {
    "react-hooks/incompatible-library": "off"
  }
}, {
  ignores: ["node_modules/**", ".next/**", ".source/**", "out/**", "build/**", "next-env.d.ts"]
}];

export default eslintConfig;
