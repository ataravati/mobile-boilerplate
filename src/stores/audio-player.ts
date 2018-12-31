import Sound from "react-native-sound";
import { Platform } from "react-native";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") {
  Sound.setMode("SpokenAudio");
}

const sounds = {};

export default class AudioPlayer {
  private filename = "";

  load = (filename: string, time: number = 0) => {
    const that = this;
    return new Promise((resolve, reject) => {
      const sound = new Sound(filename, "", function(error) {
        if (error) {
          reject(error);
        } else {
          if (time > 0) sound.setCurrentTime(time);
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
    return new Promise((resolve, reject) => {
      sounds[this.filename].getCurrentTime(
        (seconds: number, isPlaying: boolean) => {
          if (isPlaying === true) {
            resolve(seconds);
          } else {
            reject();
          }
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
}
