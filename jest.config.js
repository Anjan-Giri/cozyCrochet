module.exports = {
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.js", "**/tests/**/*.spec.js"],

  testPathIgnorePatterns: ["/node_modules/"],

  setupFiles: ["<rootDir>/tests/setup.js"],

  clearMocks: true,

  collectCoverage: true,

  collectCoverageFrom: ["backend/**/*.js", "!**/node_modules/**"],

  coverageDirectory: "coverage",
};
