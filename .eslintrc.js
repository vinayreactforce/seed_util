module.exports = {
  root: true,
  extends: '@react-native',
  globals: {
    // RN (Hermes/JSC) may provide these at runtime, but ESLint doesn't assume they exist.
    btoa: 'readonly',
    atob: 'readonly',
    alert: 'readonly',
    console: 'readonly',
    JSON: 'readonly',
    Promise: 'readonly',
    setTimeout: 'readonly',
    clearTimeout: 'readonly',
    setInterval: 'readonly',
    clearInterval: 'readonly',
    Math: 'readonly',
    Date: 'readonly',
  },
  rules: {
    // React Native provides `alert()` at runtime; allow it without warnings.
    'no-alert': 'off',
  },
};
