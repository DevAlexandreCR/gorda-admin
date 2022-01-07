module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue,ts}',
    '!src/assets/**',
    '!src/vendor/**',
    '!src/main.ts'
  ],
  setupFiles: ['<rootDir>/tests/testSetup.ts'],
}
