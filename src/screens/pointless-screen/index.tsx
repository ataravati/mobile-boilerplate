import React from "react";
import { View } from "native-base";
import AudioPlayer from "./audio-player";

interface TodoListProps {}

export class PointlessScreen extends React.Component<TodoListProps, void> {
  static navigationOptions = {
    title: "صفحه‌ی بی‌خاصیت",
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AudioPlayer filename="https://host2.rjmusicmedia.com/media/mp3/mp3-256/Sasy-Che-Pesari.mp3" />
      </View>
    );
  }
}
