import {
  types,
  onSnapshot,
  flow,
  applySnapshot,
  getSnapshot,
} from "mobx-state-tree";
import Sound from "react-native-sound";
import { Platform } from "react-native";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") {
  Sound.setMode("SpokenAudio");
}

const tracks = {};
const snapshots = {};

function load(filename: string, time: number = 0) {
  return new Promise(function(resolve, reject) {
    const sound = new Sound(filename, "", function(error) {
      if (error) {
        reject(error);
      } else {
        if (time > 0) sound.setCurrentTime(time);
        resolve(sound);
      }
    });
  });
}

function play(filename: string) {
  return new Promise(function(resolve, reject) {
    tracks[filename].play(function(success?: boolean) {
      if (success === true) {
        resolve();
      } else {
        reject();
      }
    });
  });
}

function getCurrentTime(filename: string) {
  return new Promise(function(resolve, reject) {
    tracks[filename].getCurrentTime(function(
      seconds: number,
      isPlaying: boolean,
    ) {
      if (isPlaying === true) {
        resolve(seconds);
      } else {
        reject();
      }
    });
  });
}

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
      if (self.filename && filename !== self.filename) {
        self.currentTime = yield getCurrentTime(self.filename);
        snapshots[self.filename] = getSnapshot(self);
        tracks[self.filename].release();
        tracks[self.filename] = null;

        self.currentTime = snapshots[filename]
          ? snapshots[filename].currentTime
          : 0;
        self.paused = true;
      }
      try {
        tracks[filename] = tracks[filename]
          ? tracks[filename]
          : yield load(filename, self.currentTime);

        self.isLoading = false;
        self.filename = filename;
        self.duration = tracks[filename].getDuration();
      } catch (error) {
        console.log("Failed to load the audio file.", error);
      }
    }),
    play: flow(function*() {
      if (tracks[self.filename].isLoaded()) {
        self.paused = false;
        if (Platform.OS === "ios") Sound.setActive(true);

        try {
          yield play(self.filename);
          self.paused = true;
          if (Platform.OS === "ios") Sound.setActive(false);
        } catch {
          if (Platform.OS === "android") tracks[self.filename].reset();
        }
      }
    }),
    pause() {
      tracks[self.filename].pause();
      self.paused = true;
    },
    updateCurrentTime: flow(function*() {
      try {
        let seconds = yield getCurrentTime(self.filename);
        seconds = seconds > self.duration ? self.duration : seconds;
        self.currentTime = seconds;
      } catch {}
    }),
    setCurrentTime(time: number) {
      tracks[self.filename].setCurrentTime(time);
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
