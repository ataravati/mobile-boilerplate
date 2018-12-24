import React, { Component } from "react";
import { View, Text, Button } from "native-base";
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
}

export default class AudioPlayer extends React.Component<
  AudioPlayerProps,
  AudioPlayerState
> {
  private sound = new Sound(this.props.filename, Sound.MAIN_BUNDLE, error => {
    if (error) {
      console.log("Failed to load the sound.", error);
      return;
    }
  });

  state = { isPlaying: false };

  handlePlay = () => {
    if (this.sound.isLoaded()) {
      if (this.state.isPlaying === true) {
        this.sound.pause(() => {
          this.setState({ isPlaying: false });
        });
      } else {
        if (Platform.OS === "ios") {
          Sound.setActive(true);
        }
        this.setState({ isPlaying: true });
        this.sound.play((success?) => {
          if (success) {
            if (Platform.OS === "ios") {
              Sound.setActive(false);
            }
          } else {
            if (Platform.OS === "android") {
              this.sound.reset();
            }
          }
        });
      }
    }
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={this.handlePlay}>
          <Text>{this.state.isPlaying === true ? "Pause" : "Play"}</Text>
        </Button>
      </View>
    );
  }
}
