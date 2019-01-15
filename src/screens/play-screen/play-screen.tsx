import React from "react";
import { NavigationScreenProp, NavigationState } from "react-navigation";
import { View } from "native-base";
import AudioPlayer from "./audio-player";

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

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AudioPlayer />
      </View>
    );
  }
}
