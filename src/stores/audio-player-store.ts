import { types, onSnapshot, flow, getSnapshot } from "mobx-state-tree";
import AudioPlayer from "./audio-player";

const snapshots = {};

const audioPlayer = new AudioPlayer();

const AudioPlayerStoreModel = types
  .model("AudioPlayerStore", {
    isLoading: types.boolean,
    paused: types.boolean,
    path: types.string,
    duration: types.number,
    currentTime: types.number,
    volume: types.number,
  })
  .actions(self => ({
    load: flow(function*(path: string) {
      self.isLoading = true;
      // If the track has changed...
      if (self.path && path !== self.path) {
        self.currentTime = (yield audioPlayer.getCurrentTime()).seconds;
        snapshots[self.path] = getSnapshot(self);
        audioPlayer.release();

        self.currentTime = snapshots[path] ? snapshots[path].currentTime : 0;
        self.volume = snapshots[path] ? snapshots[path].volume : 1;

        self.paused = true;
      }

      try {
        // If it's a new track...
        if (!self.path || self.path !== path)
          yield audioPlayer.load(path, self.currentTime, self.volume);

        self.path = path;
        self.duration = audioPlayer.getDuration();
      } catch (error) {
        console.log("Failed to load the audio file.", error);
      }
      self.isLoading = false;
    }),
    play: flow(function*() {
      if (audioPlayer.isLoaded()) {
        self.paused = false;

        try {
          yield audioPlayer.play();
          self.paused = true;
          self.currentTime = self.duration;
        } catch {}
      }
    }),
    pause() {
      audioPlayer.pause();
      self.paused = true;
    },
    updateCurrentTime: flow(function*() {
      try {
        let response = yield audioPlayer.getCurrentTime();
        if (response.isPlaying === true) {
          let currentTime = response.seconds;
          currentTime =
            currentTime > self.duration ? self.duration : currentTime;
          self.currentTime = currentTime;
        }
      } catch {}
    }),
    setCurrentTime(time: number) {
      audioPlayer.setCurrentTime(time);
      self.currentTime = time;
    },
    setVolume(volume: number) {
      audioPlayer.setVolume(volume);
      self.volume = volume;
    },
  }));

export const audioPlayerStore = AudioPlayerStoreModel.create({
  isLoading: true,
  paused: true,
  path: "",
  duration: -1,
  currentTime: 0,
  volume: 1,
});

onSnapshot(audioPlayerStore, snapshot => {
  console.log("snapshot:", snapshot);
});

export type AudioPlayerStore = typeof AudioPlayerStoreModel.Type;
