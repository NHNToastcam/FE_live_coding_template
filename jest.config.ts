// jest.config.cjs
/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  moduleNameMapper: {
    // 👇 1) 별칭 + SVG (가장 먼저!)
    "^@/assets/.+\\.svg$": "<rootDir>/src/__mocks__/svgMock.js",
    // 👇 2) 그 외 모든 svg
    "\\.svg$": "<rootDir>/src/__mocks__/svgMock.js",
    "^@/(.*)$": "<rootDir>/src/$1",

    // 스타일/이미지
    "\\.(css|scss|sass)$": "identity-obj-proxy",
  },

  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.[tj]s?(x)",
    "<rootDir>/src/**/*.{spec,test}.[tj]s?(x)",
    "<rootDir>/src/tests/**/*.[tj]s?(x)",
  ],
};
