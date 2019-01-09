import { audioPlayerStore } from "./audio-player-store";

jest.mock("react-native-sound");
describe("audio-player-store", () => {
  it("can load a local audio file", () => {
    const path = "sample_audio.mp3";
    return audioPlayerStore.load(path).then(() => {
      expect(audioPlayerStore.isLoading).toEqual(false);
      expect(audioPlayerStore.duration).toEqual(500);
      expect(audioPlayerStore.paused).toEqual(true);
      expect(audioPlayerStore.path).toEqual(path);
    });
  });

  it("can load a remote audio file", () => {
    const path = "https://sample-videos.com/audio/mp3/wave.mp3";
    return audioPlayerStore.load(path).then(() => {
      expect(audioPlayerStore.isLoading).toEqual(false);
      expect(audioPlayerStore.duration).toEqual(500);
      expect(audioPlayerStore.paused).toEqual(true);
      expect(audioPlayerStore.path).toEqual(path);
    });
  });
});
