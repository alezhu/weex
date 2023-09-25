/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: [
      '/dist/',
  ],
  testMatch: [
    "**/tests/**/*.(spec|test).[tj]s"
  ]
};
