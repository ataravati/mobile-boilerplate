import { Platform } from "react-native";
import { flow, types, onSnapshot } from "mobx-state-tree";
import RNFetchBlob from "rn-fetch-blob";
import { getPodcasts, updateEpisode } from "../database/allSchemas";

export const Episode = types
  .model("Episode", {
    id: types.identifier(),
    title: types.string,
    url: types.string,
    localPath: types.maybe(types.string),
    isLocal: types.optional(types.boolean, false),
    isDownloading: types.optional(types.boolean, false),
  })
  .views(self => ({
    get path() {
      return self.isLocal === true && self.localPath
        ? self.localPath
        : self.url;
    },
  }))
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

        yield updateEpisode(self);
      } catch (error) {
        console.log(`Could not download ${self.url}.`, error);
      }
      self.isDownloading = false;
    }),
    delete: flow(function*() {
      if (self.localPath) {
        try {
          yield RNFetchBlob.fs.unlink(self.localPath);
          self.isLocal = false;
          self.localPath = null;

          yield updateEpisode(self);
        } catch (error) {
          console.log(`Could not delete ${self.localPath}.`, error);
        }
      }
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
        const podcasts = yield getPodcasts();
        const episodes = podcasts[0].episodes.map(e => {
          let episode = Episode.create({
            id: e.id.toString(),
            title: e.title,
            url: e.url,
            localPath: e.localPath,
            isLocal: e.isLocal,
          });

          return episode;
        });
        self.episodes = episodes;
      } catch {}
      self.isLoading = false;
    }),
    downloadEpisode: flow(function*(episode: typeof Episode.Type) {
      episode.download();
    }),
    deleteEpisode: flow(function*(episode: typeof Episode.Type) {
      episode.delete();
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
