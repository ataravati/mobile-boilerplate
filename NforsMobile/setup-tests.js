import "react-native";

jest.mock("react-native", () => require("react-native-mock-render"), {
  virtual: true,
});
