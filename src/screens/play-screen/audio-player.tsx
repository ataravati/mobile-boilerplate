import React from "react";
import { inject, observer } from "mobx-react/native";
import { View, Spinner } from "native-base";
import SeekBar from "./seek-bar";
import Controls from "./controls";
import { AudioPlayerStore } from "../../stores/audio-player-store";
import { Episode } from "../../stores/episode-store";

export interface AudioPlayerProps {
  episode: typeof Episode.Type;
  audioPlayerStore: AudioPlayerStore;
}

export interface AudioPlayerState {}

@inject("audioPlayerStore")
@observer
export default class AudioPlayer extends React.Component<
  AudioPlayerProps,
  AudioPlayerState
> {
  constructor(props: AudioPlayerProps) {
    super(props);
    this.props.audioPlayerStore.load(this.props.episode);
  }

  trackInterval = setInterval(() => {
    if (this.props.audioPlayerStore.isLoading === false) {
      this.props.audioPlayerStore.updateCurrentTime();
    }
  }, 250);

  onPressPlay = () => {
    this.props.audioPlayerStore.paused === true ? this.play() : this.pause();
  };

  play() {
    this.props.audioPlayerStore.play();
  }

  pause() {
    this.props.audioPlayerStore.pause();
  }

  seekTo = (time: number) => {
    this.props.audioPlayerStore.setCurrentTime(time);
  };

  setVolume = (volume: number) => {
    this.props.audioPlayerStore.setVolume(volume);
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {this.props.audioPlayerStore.isLoading === true ? (
          <Spinner />
        ) : (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Controls
              paused={this.props.audioPlayerStore.paused}
              volume={this.props.audioPlayerStore.volume}
              onPressPlay={() => this.onPressPlay()}
              onVolumeChange={(volume: number) => this.setVolume(volume)}
            />
            <SeekBar
              duration={this.props.audioPlayerStore.duration}
              currentTime={this.props.audioPlayerStore.currentTime}
              onSeek={(time: number) => this.seekTo(time)}
              onSeekStart={() => this.pause()}
              onSeekEnd={() => this.play()}
            />
          </View>
        )}
      </View>
    );
  }

  componentWillUnmount() {
    clearInterval(this.trackInterval);
  }
}
