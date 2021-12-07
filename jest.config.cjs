const esModules = ['os-name', 'macos-release', 'windows-release'].join('|');

module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "node",
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
    setupFilesAfterEnv: ["./setupTests.cjs"]
  };