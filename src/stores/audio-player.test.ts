import AudioPlayer from "./audio-player";

jest.mock("react-native-sound");

describe("audio-player", () => {
  const audioPlayer = new AudioPlayer();
  it("can load audio file", () => {
    expect.assertions(3);
    const path = "sample_audio.mp3";
    let isLoaded = audioPlayer.isLoaded();
    expect(isLoaded).toEqual(false);
    return audioPlayer.load(path).then(() => {
      expect(audioPlayer.path).toEqual(path);
      isLoaded = audioPlayer.isLoaded();
      expect(isLoaded).toEqual(true);
    });
  });

  it("can load audio file at a given position in time", () => {
    expect.assertions(1);
    const path = "sample_audio.mp3";
    const time = 4;
    return audioPlayer.load(path, time).then(() => {
      return expect(audioPlayer.getCurrentTime()).resolves.toEqual({
        seconds: time,
        isPlaying: false,
      });
    });
  });
});
