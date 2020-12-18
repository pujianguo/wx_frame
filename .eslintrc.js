module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
  ],
  parserOptions: {
    // 配置解析器
    parser: 'babel-eslint',
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
  },
  // 全局变量
  globals: {
    App: true,
    Page: true,
    Component: true,
    Behavior: true,
    wx: true,
    getApp: true,
    getCurrentPages: true,
  },
}
