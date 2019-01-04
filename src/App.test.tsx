import React from "react";
import renderer from "react-test-renderer";

import { App } from "./App";

jest.mock("react-native-sound", () => {
  let _filename = null;
  let _basePath = null;

  const SoundMocked = (filename, basePath, onError, options) => {
    _filename = filename;
    _basePath = basePath;
    onError();
  };

  SoundMocked.prototype.filename = () => _filename;
  SoundMocked.prototype.basePath = () => _basePath;
  SoundMocked.prototype.play = function(onEnd) {};
  SoundMocked.prototype.pause = function(callback) {};
  SoundMocked.prototype.stop = function(callback) {};
  SoundMocked.prototype.reset = function() {};
  SoundMocked.prototype.release = function() {};
  SoundMocked.prototype.getDuration = function() {};
  SoundMocked.prototype.getVolume = function() {};
  SoundMocked.prototype.setVolume = function(value) {};
  SoundMocked.prototype.getCurrentTime = function(callback) {};
  SoundMocked.prototype.setCurrentTime = function(value) {};

  const setCategoryMocked = jest.fn((value, mixWithOthers) => {});
  SoundMocked.setCategory = setCategoryMocked.bind(SoundMocked);

  const setModeMocked = jest.fn(value => {});
  SoundMocked.setMode = setModeMocked.bind(SoundMocked);

  const setActiveMocked = jest.fn(value => {});
  SoundMocked.setActive = setActiveMocked.bind(SoundMocked);

  return SoundMocked;
});

jest.mock("rn-fetch-blob", () => "RNFetchBlob");

describe("app", () => {
  it("can render snapshot", () => {
    const tree = renderer.create(<App />);
    expect(tree).toMatchSnapshot();
  });
});
