const { defaults: tsjPreset } = require("ts-jest/presets");

module.exports = {
  ...tsjPreset,
  preset: "react-native",
  setupTestFrameworkScriptFile: "<rootDir>setup-tests.js",
  transform: {
    ...tsjPreset.transform,
    // "\\.js$": "<rootDir>/node_modules/react-native/jest/preprocessor.js",
    "\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!react-native|native-base-shoutem-theme|@shoutem/animation|@shoutem/ui|tcomb-form-native|react-navigation-stack|react-navigation)",
  ],
  globals: {
    "ts-jest": {
      babelConfig: true,
    },
  },
  cacheDirectory: ".jest/cache",
};
