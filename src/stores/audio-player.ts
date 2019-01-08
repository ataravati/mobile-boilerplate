import Sound from "react-native-sound";
import { Platform } from "react-native";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") {
  Sound.setMode("SpokenAudio");
}

const sounds = {};

export default class AudioPlayer {
  path = "";

  load = (path: string, time: number = 0, volume: number = 1) => {
    const that = this;
    return new Promise((resolve, reject) => {
      const basePath =
        path.startsWith("http") === true ? "" : Sound.MAIN_BUNDLE;
      const sound = new Sound(path, basePath, error => {
        if (error) {
          reject(error);
        } else {
          if (time > 0) sound.setCurrentTime(time);
          sound.setVolume(volume);
          sounds[path] = sound;
          that.path = path;
          resolve();
        }
      });
    });
  };

  isLoaded = () => {
    return this.path ? sounds[this.path].isLoaded() : false;
  };

  play = () => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "ios") Sound.setActive(true);
      sounds[this.path].play((success?: boolean) => {
        if (success === true) {
          if (Platform.OS === "ios") Sound.setActive(false);
          resolve();
        } else {
          if (Platform.OS === "android") sounds[this.path].reset();
          reject();
        }
      });
    });
  };

  pause = () => {
    return new Promise(resolve => {
      sounds[this.path].pause(() => {
        resolve();
      });
    });
  };

  getDuration = () => {
    return sounds[this.path].getDuration();
  };

  getCurrentTime = () => {
    return new Promise(resolve => {
      sounds[this.path].getCurrentTime(
        (seconds: number, isPlaying: boolean) => {
          resolve({ seconds, isPlaying });
        },
      );
    });
  };

  setCurrentTime = (time: number) => {
    sounds[this.path].setCurrentTime(time);
  };

  release = () => {
    sounds[this.path].release();
    sounds[this.path] = null;
  };

  getVolume = () => {
    return sounds[this.path].getVolume();
  };

  setVolume = (volume: number) => {
    sounds[this.path].setVolume(volume);
  };
}
