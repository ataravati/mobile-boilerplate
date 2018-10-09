module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    ["transform-es2015-modules-commonjs"],
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    [
      "module-resolver",
      {
        root: ["./src"],
        alias: {
          test: "./test",
          underscore: "lodash",
        },
      },
    ],
  ],
};
