import { types, onSnapshot, flow, applySnapshot } from "mobx-state-tree";
import Sound from "react-native-sound";
import { Platform } from "react-native";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") {
  Sound.setMode("SpokenAudio");
}

const track = {};

function load(filename: string) {
  return new Promise(function(resolve, reject) {
    const sound = new Sound(filename, "", function(error) {
      if (error) {
        reject(error);
      } else {
        resolve(sound);
      }
    });
  });
}

function play(filename: string) {
  return new Promise(function(resolve, reject) {
    track[filename].play(function(success?: boolean) {
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
    track[filename].getCurrentTime(function(
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
        track[self.filename].release();
        self.paused = true;
        self.currentTime = 0;
      }
      try {
        track[filename] =
          track[filename] && track[filename].isLoaded() === true
            ? track[filename]
            : yield load(filename);

        self.isLoading = false;
        self.filename = filename;
        self.duration = track[filename].getDuration();
      } catch (error) {
        console.log("Failed to load the audio file.", error);
      }
    }),
    setPaused(paused: boolean) {
      self.paused = paused;
    },
    play: flow(function*() {
      if (track[self.filename].isLoaded()) {
        self.paused = false;
        if (Platform.OS === "ios") Sound.setActive(true);

        try {
          yield play(self.filename);
          self.paused = true;
          if (Platform.OS === "ios") Sound.setActive(false);
        } catch {
          if (Platform.OS === "android") track[self.filename].reset();
        }
      }
    }),
    pause() {
      track[self.filename].pause();
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
      track[self.filename].setCurrentTime(time);
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
