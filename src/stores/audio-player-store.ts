import { types, onSnapshot, flow, getSnapshot } from "mobx-state-tree";
import AudioPlayer from "./audio-player";
import { Episode } from "./episode-store";

const snapshots = {};

const audioPlayer = new AudioPlayer();

const AudioPlayerStoreModel = types
  .model("AudioPlayerStore", {
    isLoading: types.boolean,
    paused: types.boolean,
    duration: types.number,
    currentTime: types.number,
    volume: types.number,
    speed: types.number,
    episode: types.maybe(types.reference(Episode)),
  })
  .actions(self => ({
    load: flow(function*(episode: typeof Episode.Type) {
      self.isLoading = true;
      episode.changeLoadingStatus(true);
      // If the track has changed...
      if (self.episode && episode.path !== self.episode.path) {
        self.currentTime = (yield audioPlayer.getCurrentTime()).seconds;
        snapshots[self.episode.path] = getSnapshot(self);
        audioPlayer.release();

        self.currentTime = snapshots[episode.path]
          ? snapshots[episode.path].currentTime
          : 0;
        self.volume = snapshots[episode.path]
          ? snapshots[episode.path].volume
          : 1;
        self.speed = snapshots[episode.path]
          ? snapshots[episode.path].speed
          : 1;

        self.paused = true;
        (self.episode as typeof Episode.Type).changePlayingStatus(false);
      }

      try {
        // If it's a new track...
        if (!self.episode || self.episode.path !== episode.path)
          yield audioPlayer.load(episode.path, self.currentTime, self.volume);

        self.episode = episode;
        self.duration = audioPlayer.getDuration();
      } catch (error) {
        console.log("Failed to load the audio file.", error);
      }
      self.isLoading = false;
      episode.changeLoadingStatus(false);
    }),
    play: flow(function*() {
      if (audioPlayer.isLoaded()) {
        self.paused = false;
        (self.episode as typeof Episode.Type).changePlayingStatus(true);

        try {
          yield audioPlayer.play();
          self.paused = true;
          (self.episode as typeof Episode.Type).changePlayingStatus(false);
          self.currentTime = self.duration;

          (self.episode as typeof Episode.Type).delete();
        } catch {}
      }
    }),
    pause() {
      audioPlayer.pause();
      self.paused = true;
      (self.episode as typeof Episode.Type).changePlayingStatus(false);
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
    setSpeed(value: number) {
      audioPlayer.setSpeed(value);
      self.speed = value;
    },
  }));

export const audioPlayerStore = AudioPlayerStoreModel.create({
  isLoading: false,
  paused: true,
  duration: -1,
  currentTime: 0,
  volume: 1,
  speed: 1,
});

onSnapshot(audioPlayerStore, snapshot => {
  console.log("snapshot:", snapshot);
});

export type AudioPlayerStore = typeof AudioPlayerStoreModel.Type;
