module.exports = {
  env: {
    es2021: true,
    node: true,
    browser: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    // Add your custom rules here
    'no-unused-vars': 'warn',
    'quotes': ['error', 'double'],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
