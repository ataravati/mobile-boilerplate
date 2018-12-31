import { types, onSnapshot, flow, getSnapshot } from "mobx-state-tree";
import AudioPlayer from "./audio-player";

const snapshots = {};

const audioPlayer = new AudioPlayer();

const AudioPlayerStoreModel = types
  .model("AudioPlayerStore", {
    isLoading: types.boolean,
    paused: types.boolean,
    filename: types.string,
    duration: types.number,
    currentTime: types.number,
  })
  .actions(self => ({
    load: flow(function*(filename: string) {
      self.isLoading = true;
      // If the track has changed...
      if (self.filename && filename !== self.filename) {
        self.currentTime = yield audioPlayer.getCurrentTime();
        snapshots[self.filename] = getSnapshot(self);
        audioPlayer.release();

        self.currentTime = snapshots[filename]
          ? snapshots[filename].currentTime
          : 0;

        self.paused = true;
      }

      try {
        // If it's a new track...
        if (!self.filename || self.filename !== filename)
          yield audioPlayer.load(filename, self.currentTime);

        self.isLoading = false;
        self.filename = filename;
        self.duration = audioPlayer.getDuration();
      } catch (error) {
        console.log("Failed to load the audio file.", error);
      }
    }),
    play: flow(function*() {
      if (audioPlayer.isLoaded()) {
        self.paused = false;

        try {
          yield audioPlayer.play();
          self.paused = true;
        } catch {}
      }
    }),
    pause() {
      audioPlayer.pause();
      self.paused = true;
    },
    updateCurrentTime: flow(function*() {
      try {
        let currentTime = yield audioPlayer.getCurrentTime();
        currentTime = currentTime > self.duration ? self.duration : currentTime;
        self.currentTime = currentTime;
      } catch {}
    }),
    setCurrentTime(time: number) {
      audioPlayer.setCurrentTime(time);
      self.currentTime = time;
    },
  }));

export const audioPlayerStore = AudioPlayerStoreModel.create({
  isLoading: true,
  paused: true,
  filename: "",
  duration: -1,
  currentTime: 0,
});

onSnapshot(audioPlayerStore, snapshot => {
  console.log("snapshot:", snapshot);
});

export type AudioPlayerStore = typeof AudioPlayerStoreModel.Type;
