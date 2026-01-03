/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "<rootDir>/e2e/",
  ],
};
