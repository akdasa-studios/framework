module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  testMatch: [
    '<rootDir>/tests/**/*.spec.ts'
  ],
  moduleNameMapper: {
    '^@akd-studios/framework/(.*)': '<rootDir>/lib/$1',
    '^@lib/(.*)': '<rootDir>/lib/$1',
    '^@tests/(.*)': '<rootDir>/tests/$1',
  }
}
