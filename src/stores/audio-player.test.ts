import AudioPlayer from "./audio-player";

jest.mock("react-native-sound");

describe("audio-player", () => {
  const audioPlayer = new AudioPlayer();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("can load audio file", () => {
    const path = "sample_audio.mp3";
    let isLoaded = audioPlayer.isLoaded();
    expect(isLoaded).toEqual(false);
    return audioPlayer.load(path).then(() => {
      expect(audioPlayer.path).toEqual(path);
      isLoaded = audioPlayer.isLoaded();
      expect(isLoaded).toEqual(true);
      expect(audioPlayer.getDuration()).toEqual(500);
    });
  });

  it("can load audio file at a given position in time", () => {
    const path = "sample_audio.mp3";
    const time = 4;
    return audioPlayer.load(path, time).then(() => {
      return expect(audioPlayer.getCurrentTime()).resolves.toEqual({
        seconds: time,
        isPlaying: false,
      });
    });
  });

  it("can load audio file with a given volumne", () => {
    const path = "sample_audio.mp3";
    const volume = 0.5;
    return audioPlayer.load(path, 0, volume).then(() => {
      expect(audioPlayer.getVolume()).toEqual(volume);
    });
  });

  it("can change the volume", () => {
    let volume = 0.8;
    audioPlayer.setVolume(0.8);
    expect(audioPlayer.getVolume()).toEqual(volume);
    audioPlayer.setVolume(volume - 0.3);
    expect(audioPlayer.getVolume()).toEqual(volume - 0.3);
  });

  it("can change current time", () => {
    let time = 250;
    audioPlayer.setCurrentTime(time);
    return expect(audioPlayer.getCurrentTime()).resolves.toEqual({
      seconds: time,
      isPlaying: false,
    });
  });
});
