module.exports = {
  preset: 'ts-jest',
  testEnvironment: './tests/BrowserTestEnvironment.js',
  roots: ['<rootDir>/tests'],
  testMatch: ['<rootDir>/tests/**/*.test.ts'],
  testPathIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/node_modules/'],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  collectCoverageFrom: [
    'index.ts',
    '!**/node_modules/**',
    '!**/dist/**',
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  testTimeout: 120000,
  setupFilesAfterEnv: [],
  moduleFileExtensions: ['ts', 'js', 'json'],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
};
