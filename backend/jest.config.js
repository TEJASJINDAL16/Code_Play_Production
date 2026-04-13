/** @type {import('jest').Config} */
export default {
  testEnvironment: 'node',
  transform: {},
  extensionsToTreatAsEsm: [],
  testMatch: ['**/tests/**/*.test.js'],
  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,
  // Coverage configuration
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!jest.config.js',
    '!eslint.config.js',
  ],
  coverageDirectory: 'coverage',
  // Timeout for long-running tests (DB operations)
  testTimeout: 30000,
};
