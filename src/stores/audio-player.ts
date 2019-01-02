import Sound from "react-native-sound";
import { Platform } from "react-native";
import { number } from "mobx-state-tree/dist/internal";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") {
  Sound.setMode("SpokenAudio");
}

const sounds = {};

export default class AudioPlayer {
  private filename = "";

  load = (filename: string, time: number = 0, volume: number = 1) => {
    const that = this;
    return new Promise((resolve, reject) => {
      const basePath =
        filename.startsWith("http") === true ? "" : Sound.MAIN_BUNDLE;
      const sound = new Sound(filename, basePath, function(error) {
        if (error) {
          reject(error);
        } else {
          if (time > 0) sound.setCurrentTime(time);
          sound.setVolume(volume);
          sounds[filename] = sound;
          that.filename = filename;
          resolve();
        }
      });
    });
  };

  isLoaded = () => {
    return this.filename && sounds[this.filename].isLoaded();
  };

  play = () => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "ios") Sound.setActive(true);
      sounds[this.filename].play((success?: boolean) => {
        if (success === true) {
          if (Platform.OS === "ios") Sound.setActive(false);
          resolve();
        } else {
          if (Platform.OS === "android") sounds[this.filename].reset();
          reject();
        }
      });
    });
  };

  pause = () => {
    return new Promise(resolve => {
      sounds[this.filename].pause(() => {
        resolve();
      });
    });
  };

  getDuration = () => {
    return sounds[this.filename].getDuration();
  };

  getCurrentTime = () => {
    return new Promise(resolve => {
      sounds[this.filename].getCurrentTime(
        (seconds: number, isPlaying: boolean) => {
          resolve({ seconds, isPlaying });
        },
      );
    });
  };

  setCurrentTime = (time: number) => {
    sounds[this.filename].setCurrentTime(time);
  };

  release = () => {
    sounds[this.filename].release();
    sounds[this.filename] = null;
  };

  getVolume = () => {
    return sounds[this.filename].getVolume();
  };

  setVolume = (volume: number) => {
    sounds[this.filename].setVolume(volume);
  };
}
