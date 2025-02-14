module.exports = function (wallaby) {
  return {
    autoDetect: ['vitest'],
    files: ['src/services/*.ts'],

    // tests: ['test/**/*.test.ts'],
  }
}
