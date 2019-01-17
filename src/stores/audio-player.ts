import Sound from "react-native-sound";
import { Platform } from "react-native";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") Sound.setMode("SpokenAudio");

export default class AudioPlayer {
  private sound: Sound | null = null;
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
          this.sound = sound;
          that.path = path;
          resolve();
        }
      });
    });
  };

  isLoaded = () => {
    return this.path ? this.sound!.isLoaded() : false;
  };

  play = () => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === "ios") Sound.setActive(true);
      this.sound!.play((success?: boolean) => {
        if (success === true) {
          if (Platform.OS === "ios") Sound.setActive(false);
          resolve();
        } else {
          if (Platform.OS === "android") this.sound!.reset();
          reject();
        }
      });
    });
  };

  pause = () => {
    return new Promise(resolve => {
      this.sound!.pause(() => {
        resolve();
      });
    });
  };

  getDuration = () => {
    return this.sound!.getDuration();
  };

  getCurrentTime = () => {
    return new Promise(resolve => {
      this.sound!.getCurrentTime((seconds: number, isPlaying: boolean) => {
        resolve({ seconds, isPlaying });
      });
    });
  };

  setCurrentTime = (time: number) => {
    if (time < 0) time = 0;
    if (time > this.getDuration()) time = this.getDuration();

    this.sound!.setCurrentTime(time);
  };

  release = () => {
    this.sound!.release();
  };

  getVolume = () => {
    return this.sound!.getVolume();
  };

  setVolume = (volume: number) => {
    this.sound!.setVolume(volume);
  };

  setSpeed = (speed: number) => {
    this.sound!.setSpeed(speed);
  };
}
