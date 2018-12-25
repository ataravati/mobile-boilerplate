import React, { Component } from "react";
import { View, Text, Button } from "native-base";
import { Slider } from "react-native";
import Sound from "react-native-sound";
import { Platform } from "react-native";

Sound.setCategory("Playback", true);
if (Platform.OS === "ios") {
  Sound.setMode("SpokenAudio");
}

export interface AudioPlayerProps {
  filename: string;
}

export interface AudioPlayerState {
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
  });

  state = { isPlaying: false, duration: -1, currentTime: 0 };

  seekTimer = setInterval(() => {
    this.sound.getCurrentTime((seconds, isPlaying) => {
      if (isPlaying === true)
        this.setState({ currentTime: Math.floor(seconds) });
    });
  }, 250);

  handlePlay = () => {
    if (this.state.isPlaying === false) {
      if (this.sound.isLoaded()) {
        this.setState({
          isPlaying: true,
          duration: Math.floor(this.sound.getDuration()),
        });
        if (Platform.OS === "ios") Sound.setActive(true);

        this.sound.play((success?) => {
          this.setState({ isPlaying: false });
          if (Platform.OS === "ios") {
            Sound.setActive(false);
          }
          if (!success) {
            if (Platform.OS === "android") this.sound.reset();
          }
        });
      }
    } else {
      this.sound.pause(() => {
        this.setState({ isPlaying: false });
      });
    }
  };

  render() {
    return (
      <View
        style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
      >
        <View>
          <Button onPress={this.handlePlay}>
            <Text>{this.state.isPlaying === false ? "Play" : "Pause"}</Text>
          </Button>
        </View>
        <View>
          <Text>Duration: {this.formatTime(this.state.duration)}</Text>
          <Text>Current Time: {this.formatTime(this.state.currentTime)}</Text>
          <Slider
            style={{ direction: "ltr", marginTop: 10 }}
            maximumValue={this.getSliderMaxValue()}
            value={this.state.currentTime}
          />
        </View>
      </View>
    );
  }

  getSliderMaxValue() {
    return Math.max(1, this.state.duration, this.state.currentTime);
  }

  formatTime(time) {
    if (time < 1) return "00:00";

    let result = "";
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;

    if (hours > 0) result += hours + ":";

    result += this.padZero(minutes) + ":" + this.padZero(seconds);

    return result;
  }

  padZero(number) {
    if (number < 10) {
      return "0" + number;
    }
    return number;
  }
}
