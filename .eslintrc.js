module.exports = {
  root: true,
  env: {
    node: true, browser: true,
  },
  plugins: ['@typescript-eslint'],
  'extends': ['plugin:vue/vue3-recommended', 'eslint:recommended', '@vue/typescript/recommended', 'plugin:@typescript-eslint/eslint-recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parser: require.resolve('@typescript-eslint/parser'),
    extraFileExtensions: ['.vue'],
    ecmaFeatures: {
      jsx: true
    }
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-deprecated-router-link-tag-prop': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': 'off'
  },
  overrides: [{
    files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'], env: {
      jest: true
    }
  }],
  globals: {
    defineProps: "readonly", defineEmits: "readonly"
  }
}
