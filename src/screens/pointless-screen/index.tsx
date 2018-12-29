import React from "react";
import { Provider } from "mobx-react";
import { View } from "native-base";
import AudioPlayer from "./audio-player";
import { audioPlayerStore } from "../../stores/audio-player-store";

interface TodoListProps {}

export class PointlessScreen extends React.Component<TodoListProps, void> {
  static navigationOptions = {
    title: "صفحه‌ی بی‌خاصیت",
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <AudioPlayer
          audioPlayerStore={audioPlayerStore}
          filename="http://feeds.soundcloud.com/stream/247409391-tehranpodcast-lfuo5sqr9aby.mp3"
        />
      </View>
    );
  }
}
