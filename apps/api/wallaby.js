module.exports = function (wallaby) {
  return {
    autoDetect: ['bun test'],
    files: ['src/**/*.ts'],

    tests: ['test/**/*.test.ts'],
  }
}
