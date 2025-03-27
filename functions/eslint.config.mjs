import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";

export default [
  { 
    files: ["**/*.{js,mjs,cjs,jsx}"], 
    languageOptions: { 
      globals: globals.node // Use Node.js globals instead of browser
    } 
  },
  pluginJs.configs.recommended,
  pluginReact.configs.flat.recommended,
];
