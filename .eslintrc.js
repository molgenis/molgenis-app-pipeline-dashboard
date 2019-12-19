module.exports = {
  parser: "vue-eslint-parser",
  parserOptions: {
    "parser": "@typescript-eslint/parser"
  },
  env: {
    jest: true
  },
  extends: [
    'plugin:vue/essential',
    "plugin:@typescript-eslint/recommended"
  ],
  plugins: ["@typescript-eslint"],
  rules: {
    'camelcase': 'off',
    "@typescript-eslint/camelcase": "off",
    "@typescript-eslint/no-var-requires": "off"
  }
}
