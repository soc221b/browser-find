/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@browser-find/core$": "<rootDir>/../core/lib/main.ts",
    "^@browser-find/core/(.*)$": "<rootDir>/../core/lib/$1",
  },
  testPathIgnorePatterns: [
    "<rootDir>/e2e/",
  ],
};
