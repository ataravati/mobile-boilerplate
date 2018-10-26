import React from "react";
import renderer from "react-test-renderer";

import { App } from "./App";

describe("app", () => {
  it("can render snapshot", () => {
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });
});
