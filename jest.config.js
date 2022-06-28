module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    "^.+\\.js$": "babel-jest",
    '^.+\\.vue$': '@vue/vue3-jest'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{js,vue,ts}',
    '!src/assets/**',
    '!src/vendor/**',
    '!src/main.ts'
  ],
  testEnvironment: 'jsdom',
  setupFiles: ['core-js'],
  setupFilesAfterEnv: ['<rootDir>/tests/testSetup.ts']
}
