import React, { Component } from "react";
import { inject, observer } from "mobx-react/native";
import { View, Text, Button, Spinner } from "native-base";
import SeekBar from "./seek-bar";
import { AudioPlayerStore } from "../../stores/audio-player-store";

export interface AudioPlayerProps {
  filename: string;
  audioPlayerStore: AudioPlayerStore;
}

export interface AudioPlayerState {}

@inject("audioPlayerStore")
@observer
export default class AudioPlayer extends Component<
  AudioPlayerProps,
  AudioPlayerState
> {
  constructor(props: AudioPlayerProps) {
    super(props);
    this.props.audioPlayerStore.load(this.props.filename);
  }

  seekTimer = setInterval(() => {
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

  onSeek = (time: number) => {
    this.props.audioPlayerStore.setCurrentTime(time);
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {this.props.audioPlayerStore.isLoading === true ? (
          <Spinner />
        ) : (
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Button onPress={this.onPressPlay}>
                <Text>
                  {this.props.audioPlayerStore.paused === true
                    ? "Play"
                    : "Pause"}
                </Text>
              </Button>
            </View>
            <SeekBar
              duration={this.props.audioPlayerStore.duration}
              currentTime={this.props.audioPlayerStore.currentTime}
              onSeek={(time: number) => this.onSeek(time)}
              onPlay={() => this.play()}
              onPause={() => this.pause()}
            />
          </View>
        )}
      </View>
    );
  }
}