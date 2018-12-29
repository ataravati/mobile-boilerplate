import React from "react";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { View } from "native-base";
import AudioPlayer from "./audio-player";
import { audioPlayerStore } from "../../stores/audio-player-store";

interface PointlessScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}

export class PointlessScreen extends React.Component<
  PointlessScreenProps,
  void
> {
  static navigationOptions = {
    title: "صفحه‌ی بی‌خاصیت",
  };

  filename = this.props.navigation.getParam("filename");

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AudioPlayer
          audioPlayerStore={audioPlayerStore}
          filename={this.filename}
        />
      </View>
    );
  }
}
