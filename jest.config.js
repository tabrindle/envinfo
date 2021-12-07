const esModules = ['os-name', 'macos-release', 'windows-release'].join('|');

module.exports = {
    transform: {
      "^.+\\.(mjs|js|jsx)$": "babel-jest",
    },
    testEnvironment: "node",
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    setupFilesAfterEnv: ["./setupTests.js"],
    moduleFileExtensions: ["js", "jsx", "mjs"]
  };