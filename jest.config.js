/** @type {import('ts-jest').JestConfigWithTsJest} **/
// eslint-disable-next-line no-undef
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  collectCoverage: true, // Enable coverage collection
  collectCoverageFrom: [
    "src/**/*.ts", // Include all TypeScript files in the src folder
    "!src/**/*.d.ts", // Exclude TypeScript declaration files
    "!src/index.ts", // Exclude index files
    "!src/**/__tests__/**", // Exclude test files
  ],
  coverageDirectory: "coverage", // Output directory for coverage reports
  coverageThreshold: {
    global: {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100,
    },
  },
};