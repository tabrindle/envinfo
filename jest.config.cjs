const esModules = ['os-name'].join('|');

module.exports = {
    transform: {
      "^.+\\.(js|jsx)$": "babel-jest",
    },
    testEnvironment: "node",
    transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  };