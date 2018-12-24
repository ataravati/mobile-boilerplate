import React from "react";
import { Text, Button, View } from "native-base";
import Sound from "react-native-sound";

Sound.setActive(true);
Sound.setCategory("Playback", true);

interface TodoListProps {}
const sound = new Sound('sample_audio.mp3', Sound.MAIN_BUNDLE, (error) => {
  if (error) {
    console.log('Failed to load the sound.', error);
    return;
  }
});

export class PointlessScreen extends React.Component<TodoListProps, void> {
  static navigationOptions = {
    title: "صفحه‌ی بی‌خاصیت",
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={() => this.play()}>
          <Text>Play</Text>
        </Button>
        <Button onPress={() => this.pause()}>
          <Text>Pause</Text>
        </Button>
        <Button onPress={() => this.stop()}>
          <Text>Stop</Text>
        </Button>
      </View>
    );
  }

  play() {
    if(sound) {
      sound.play();
    }
  }

  pause() {
    if(sound) {
      sound.pause();
    }
  }

  stop() {
    if(sound) {
      sound.stop();
    }
  }
}
