import React from "react";
import renderer from "react-test-renderer";

import { App } from "./App";

jest.mock("rn-fetch-blob", () => "RNFetchBlob");
jest.mock("react-native-track-player", () => {
  const TrackPlayerMocked = () => {};

  const addEventListenerMocked = jest.fn((event, callback) => {});
  TrackPlayerMocked.addEventListener = addEventListenerMocked.bind(
    TrackPlayerMocked,
  );

  return TrackPlayerMocked;
});

describe("app", () => {
  it("can render snapshot", () => {
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });
});
