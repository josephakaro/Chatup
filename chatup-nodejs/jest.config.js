// jest.config.js

module.exports = {
  testEnvironment: "node",
  verbose: false,
  setupFiles: ["<rootDir>/tests/setup.js"],
  moduleNameMapper: {
    "@prisma/client": "<rootDir>/tests/__mocks__/prisma.js",
  },
}
