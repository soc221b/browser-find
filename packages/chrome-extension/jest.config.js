/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@browser-find/core$": "<rootDir>/../core/src/index.ts",
    "^@browser-find/core/(.*)$": "<rootDir>/../core/src/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/e2e/",
  ],
};
