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
        <AudioPlayer filename="http://feeds.soundcloud.com/stream/247409391-tehranpodcast-lfuo5sqr9aby.mp3" />
      </View>
    );
  }
}
