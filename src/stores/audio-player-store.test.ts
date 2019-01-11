import { audioPlayerStore } from "./audio-player-store";
import { Episode } from "./episode-store";

jest.mock("react-native-sound");
jest.mock("rn-fetch-blob", () => "RNFetchBlob");

describe("audio-player-store", () => {
  it("can load a local audio file", () => {
    const episode = Episode.create({
      id: "1",
      title: "test",
      url: "https://sample-videos.com/audio/mp3/wave.mp3",
      localPath: "sample_audio.mp3",
      isDownloading: false,
    });

    return audioPlayerStore.load(episode).then(() => {
      expect(audioPlayerStore.isLoading).toEqual(false);
      expect(audioPlayerStore.duration).toEqual(500);
      expect(audioPlayerStore.paused).toEqual(true);
      expect(audioPlayerStore.episode).not.toBeNull();
      expect(audioPlayerStore.episode!.id).toEqual(episode.id);
    });
  });

  it("can load a remote audio file", () => {
    const episode = Episode.create({
      id: "1",
      title: "test",
      url: "https://sample-videos.com/audio/mp3/wave.mp3",
      localPath: null,
      isDownloading: false,
    });

    return audioPlayerStore.load(episode).then(() => {
      expect(audioPlayerStore.isLoading).toEqual(false);
      expect(audioPlayerStore.duration).toEqual(500);
      expect(audioPlayerStore.paused).toEqual(true);
      expect(audioPlayerStore.episode).not.toBeNull();
      expect(audioPlayerStore.episode!.id).toEqual(episode.id);
    });
  });
});
