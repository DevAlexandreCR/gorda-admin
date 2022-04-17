module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue,ts}',
    '!src/assets/**',
    '!src/vendor/**',
    '!src/main.ts'
  ],
  setupFiles: ['core-js'],
  setupFilesAfterEnv: ['<rootDir>/tests/testSetup.ts']
}
