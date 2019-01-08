import React from "react";
import renderer from "react-test-renderer";

import { App } from "./App";

jest.mock("rn-fetch-blob", () => "RNFetchBlob");

describe("app", () => {
  it("can render snapshot", () => {
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });
});
