import { types, onSnapshot, flow, getSnapshot } from "mobx-state-tree";
import TrackPlayer, { Track } from "react-native-track-player";
import { Episode } from "./episode-store";

const snapshots = {};

const onStateChanged = TrackPlayer.addEventListener("playback-state", data => {
  console.log("State:", data.state);
  audioPlayerStore.changeState(data.state);
});

const AudioPlayerStoreModel = types
  .model("AudioPlayerStore", {
    state: types.maybe(types.string),
    duration: types.number,
    currentTime: types.number,
    volume: types.number,
    speed: types.number,
    episode: types.maybe(types.reference(Episode)),
  })
  .views(self => ({
    get isLoading() {
      return self.state === TrackPlayer.STATE_BUFFERING;
    },
    get isPlaying() {
      return self.state === TrackPlayer.STATE_PLAYING;
    },
    get paused() {
      return self.state === TrackPlayer.STATE_PAUSED;
    },
  }))
  .actions(self => ({
    setup: flow(function*() {
      console.log("STATE_NONE", TrackPlayer.STATE_NONE);
      console.log("STATE_BUFFERING", TrackPlayer.STATE_BUFFERING);
      console.log("STATE_PLAYING", TrackPlayer.STATE_PLAYING);
      console.log("STATE_PAUSED", TrackPlayer.STATE_PAUSED);
      console.log("STATE_STOPPED", TrackPlayer.STATE_STOPPED);

      yield TrackPlayer.setupPlayer();
      TrackPlayer.updateOptions({
        stopWithApp: true,
        capabilities: [
          // TrackPlayer.CAPABILITY_PLAY,
          // TrackPlayer.CAPABILITY_PAUSE,
        ],
        compactCapabilities: [
          // TrackPlayer.CAPABILITY_PLAY,
          // TrackPlayer.CAPABILITY_PAUSE,
        ],
        notificationCapabilities: [],
      });
    }),
    addEpisode: flow(function*(episode: typeof Episode.Type) {
      // If the track has changed...
      if (self.episode && episode.path !== self.episode.path) {
        self.currentTime = yield TrackPlayer.getPosition();
        snapshots[self.episode.path] = getSnapshot(self);
        yield TrackPlayer.reset();

        self.speed = 1;
        if (snapshots[episode.path]) {
          self.currentTime = snapshots[episode.path].currentTime;
          self.volume = snapshots[episode.path].volume;
        } else {
          self.currentTime = 0;
          self.volume = 1;
        }
      }

      // If it's a new track...
      if (!self.episode || self.episode.path !== episode.path) {
        const track = {
          id: episode.id.toString(),
          url: episode.path,
          title: episode.title,
          artist: "رادیو روغن حبه‌ی انگور",
        };

        yield TrackPlayer.add(track);

        self.episode = episode;
      }
    }),
    changeState: flow(function*(state: string) {
      self.state = state;

      if (self.state === TrackPlayer.STATE_PLAYING) {
        self.duration = yield TrackPlayer.getDuration();
        yield TrackPlayer.seekTo(self.currentTime);
        yield TrackPlayer.setVolume(self.volume);
      }

      if (self.episode) {
        (self.episode as typeof Episode.Type).changeLoadingStatus(
          self.isLoading,
        );

        (self.episode as typeof Episode.Type).changePlayingStatus(
          self.isPlaying,
        );
      }
    }),
    play: flow(function*() {
      try {
        yield TrackPlayer.play();
      } catch {}
    }),
    pause: flow(function*() {
      try {
        yield TrackPlayer.pause();
      } catch {}
    }),
    updateCurrentTime: flow(function*() {
      try {
        let currentTime = yield TrackPlayer.getPosition();
        currentTime = currentTime > self.duration ? self.duration : currentTime;
        self.currentTime = currentTime;
      } catch {}
    }),
    setCurrentTime: flow(function*(time: number) {
      yield TrackPlayer.seekTo(time);
      self.currentTime = time;
    }),
    setVolume: flow(function*(volume: number) {
      yield TrackPlayer.setVolume(volume);
      self.volume = volume;
    }),
    setSpeed: flow(function*(value: number) {
      yield TrackPlayer.setRate(value);
      self.speed = value;
    }),
  }));

export const audioPlayerStore = AudioPlayerStoreModel.create({
  state: TrackPlayer.STATE_NONE,
  duration: -1,
  currentTime: 0,
  volume: 1,
  speed: 1,
});

onSnapshot(audioPlayerStore, snapshot => {
  // console.log("snapshot:", snapshot);
});

export type AudioPlayerStore = typeof AudioPlayerStoreModel.Type;
