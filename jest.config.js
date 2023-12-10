module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    "^.+\\.js$": "babel-jest",
    '^.+\\.vue$': '@vue/vue3-jest',
    "^.+\\.(t|j)sx?$": ['ts-jest', { isolatedModules: true }]
  },
  collectCoverage: false,
  collectCoverageFrom: [
    'src/**/*.{js,vue,ts}',
    '!src/assets/**',
    '!src/vendor/**',
    '!src/main.ts'
  ],
  testEnvironment: 'node',
  setupFiles: ['core-js'],
  setupFilesAfterEnv: ['<rootDir>/tests/testSetup.ts']
}
