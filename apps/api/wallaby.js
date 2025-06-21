export default function (wallaby) {
  return {
    autoDetect: ['vitest'],
    env: {
      type: 'node',
    },
    // files: ['src/services/*.ts'],

    // tests: ['test/**/*.test.ts'],
  }
}
