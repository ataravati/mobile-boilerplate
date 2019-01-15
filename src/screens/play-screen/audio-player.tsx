import React from "react";
import { inject, observer } from "mobx-react/native";
import { View, Spinner } from "native-base";
import SeekBar from "./seek-bar";
import Controls from "./controls";
import { AudioPlayerStore } from "../../stores/audio-player-store";

export interface AudioPlayerProps {
  audioPlayerStore?: AudioPlayerStore;
}

export interface AudioPlayerState {}

@inject("audioPlayerStore")
@observer
export default class AudioPlayer extends React.Component<
  AudioPlayerProps,
  AudioPlayerState
> {
  private pausedBeforeSeekStart = true;

  constructor(props: AudioPlayerProps) {
    super(props);
  }

  trackInterval = setInterval(() => {
    if (this.props.audioPlayerStore!.isLoading === false) {
      this.props.audioPlayerStore!.updateCurrentTime();
    }
  }, 250);

  onPressPlay = () => {
    this.props.audioPlayerStore!.paused === true ? this.play() : this.pause();
  };

  play() {
    this.props.audioPlayerStore!.play();
  }

  pause() {
    this.props.audioPlayerStore!.pause();
  }

  onSeekStart = () => {
    this.pausedBeforeSeekStart = this.props.audioPlayerStore!.paused;
    this.pause();
  };

  onSeekEnd = () => {
    if (this.pausedBeforeSeekStart === false) this.play();
  };

  seekTo = (time: number) => {
    this.props.audioPlayerStore!.setCurrentTime(time);
  };

  setVolume = (volume: number) => {
    this.props.audioPlayerStore!.setVolume(volume);
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {this.props.audioPlayerStore!.isLoading === true ? (
          <Spinner />
        ) : (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <Controls
              paused={this.props.audioPlayerStore!.paused}
              volume={this.props.audioPlayerStore!.volume}
              onPressPlay={() => this.onPressPlay()}
              onVolumeChange={(volume: number) => this.setVolume(volume)}
            />
            <SeekBar
              duration={this.props.audioPlayerStore!.duration}
              currentTime={this.props.audioPlayerStore!.currentTime}
              onSeek={(time: number) => this.seekTo(time)}
              onSeekStart={() => this.onSeekStart()}
              onSeekEnd={() => this.onSeekEnd()}
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
