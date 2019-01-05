import { Platform } from "react-native";
import { flow, types, onSnapshot } from "mobx-state-tree";
import RNFetchBlob from "rn-fetch-blob";

const getEpisodes = () => {
  return new Promise(resolve => {
    const episodes = [
      {
        title: "فصل دوم - قسمت ۵ - کاش اینجا بودی",
        url:
          "http://feeds.soundcloud.com/stream/247409391-tehranpodcast-lfuo5sqr9aby.mp3",
      },
      {
        title: "مستند صوتی «بازیِ گوش» قسمت نهم: با پیمان یزدانیان",
        url:
          "http://feeds.soundcloud.com/stream/325004379-tehranpodcast-hermes09.mp3",
      },
    ];
    resolve(episodes);
  });
};

export const Episode = types
  .model("Episode", {
    title: types.string,
    url: types.string,
    localPath: types.optional(types.string, ""),
    isLocal: types.optional(types.boolean, false),
    isDownloading: types.optional(types.boolean, false),
  })
  .actions(self => ({
    download: flow(function*() {
      self.isDownloading = true;
      const dirs = RNFetchBlob.fs.dirs;
      const filename = self.url.split("/").pop() as string;
      try {
        const res = yield RNFetchBlob.config({
          fileCache: true,
          path: dirs.MainBundleDir + "/" + filename,
        }).fetch("GET", self.url);
        console.log(`The file saved to ${res.path()}.`);
        self.isLocal = true;
        self.localPath = Platform.OS === "android" ? res.path() : filename;
      } catch (error) {
        console.log(`Could not download ${self.url}.`, error);
      }
      self.isDownloading = false;
    }),
  }));

const EpisodeStoreModel = types
  .model("EpisodeStore", {
    isLoading: types.boolean,
    episodes: types.array(Episode),
  })
  .actions(self => ({
    fetchAll: flow(function*() {
      self.isLoading = true;
      try {
        self.episodes = yield getEpisodes();
      } catch {}
      self.isLoading = false;
    }),
    downloadEpisode: flow(function*(episode: typeof Episode.Type) {
      episode.download();
    }),
  }));

export const episodeStore = EpisodeStoreModel.create({
  isLoading: false,
  episodes: [],
});

onSnapshot(episodeStore, snapshot => {
  console.log("snapshot:", snapshot);
});

export type EpisodeStore = typeof EpisodeStoreModel.Type;
