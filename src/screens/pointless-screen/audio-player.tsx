import React, { Component } from "react";
import { View, Text, Button, Spinner } from "native-base";
import Sound from "react-native-sound";
import { Platform } from "react-native";
import SeekBar from "./seek-bar";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") {
  Sound.setMode("SpokenAudio");
}

export interface AudioPlayerProps {
  filename: string;
}

export interface AudioPlayerState {
  isLoaded: boolean;
  isPlaying: boolean;
  duration: number;
  currentTime: number;
}

export default class AudioPlayer extends React.Component<
  AudioPlayerProps,
  AudioPlayerState
> {
  private sound = new Sound(this.props.filename, "", error => {
    if (error) {
      console.log("Failed to load the sound.", error);
      return;
    }

    this.setState({ isLoaded: true, duration: this.sound.getDuration() });
  });

  state = { isLoaded: false, isPlaying: false, duration: -1, currentTime: 0 };

  seekTimer = setInterval(() => {
    this.sound.getCurrentTime((seconds, isPlaying) => {
      if (isPlaying === true) {
        seconds = seconds > this.state.duration ? this.state.duration : seconds;
        this.setState({ currentTime: seconds });
      }
    });
  }, 250);

  onPressPlay = () => {
    this.state.isPlaying === false ? this.play() : this.pause();
  };

  play() {
    if (this.sound.isLoaded()) {
      this.setState({ isPlaying: true });
      if (Platform.OS === "ios") Sound.setActive(true);

      this.sound.play((success?) => {
        this.setState({ isPlaying: false });
        if (Platform.OS === "ios") Sound.setActive(false);
        if (!success && Platform.OS === "android") this.sound.reset();
      });
    }
  }

  pause() {
    this.sound.pause(() => {
      this.setState({ isPlaying: false });
    });
  }

  onSeek = time => {
    this.sound.setCurrentTime(time);
    this.setState({ currentTime: time });
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {!this.state.isLoaded ? (
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
              <Button
                onPress={this.onPressPlay}
                disabled={!this.state.isLoaded}
              >
                <Text>{this.state.isPlaying === false ? "Play" : "Pause"}</Text>
              </Button>
            </View>
            <SeekBar
              duration={this.state.duration}
              currentTime={this.state.currentTime}
              onSeek={time => this.onSeek(time)}
              onPlay={() => this.play()}
              onPause={() => this.pause()}
            />
          </View>
        )}
      </View>
    );
  }

  // componentWillUnmount() {
  //   this.sound.release();
  // }
}
