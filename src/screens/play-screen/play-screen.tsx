import React from "react";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { View } from "native-base";
import AudioPlayer from "./audio-player";
import { audioPlayerStore } from "../../stores/audio-player-store";
import { Episode } from "../../stores/episode-store";

interface PointlessScreenProps {
  navigation: NavigationScreenProp<NavigationState>;
}

export class PointlessScreen extends React.Component<
  PointlessScreenProps,
  void
> {
  static navigationOptions = {
    title: "در حال پخش",
  };

  episode: typeof Episode.Type = this.props.navigation.getParam("episode");

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AudioPlayer
          audioPlayerStore={audioPlayerStore}
          episode={this.episode}
        />
      </View>
    );
  }
}