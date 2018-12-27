import React, { Component } from "react";
import { View, Text, Button } from "native-base";
import { ActivityIndicator, Slider } from "react-native";
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
    this.play();
  };

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <ActivityIndicator
          size="large"
          color="#0000ff"
          animating={!this.state.isLoaded}
        />
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Button onPress={this.onPressPlay} disabled={!this.state.isLoaded}>
              <Text>{this.state.isPlaying === false ? "Play" : "Pause"}</Text>
            </Button>
          </View>
          <View style={{ flexDirection: "row", direction: "ltr" }}>
            <Text>Elapsed: {this.formatTime(this.state.currentTime)}</Text>
            <Text style={{ marginStart: 20 }}>
              Remaining:{" "}
              {this.formatTime(this.state.duration - this.state.currentTime)}
            </Text>
          </View>
          <Slider
            style={{ direction: "ltr", marginTop: 10 }}
            maximumValue={this.getSliderMaxValue()}
            value={this.state.currentTime}
            onTouchStart={() => this.pause()}
            onSlidingComplete={value => this.onSeek(value)}
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
    const seconds = Math.floor(time % 60);

    if (hours > 0) result += hours + ":";

    result += this.padZero(minutes) + ":" + this.padZero(seconds);

    return result;
  }

  padZero(number) {
    if (number < 10) return "0" + number;
    return number;
  }
}
