import React from "react";
import { Text, Button, View } from "native-base";
import Sound from "react-native-sound";

Sound.setActive(true);
Sound.setCategory("Playback", false);

interface TodoListProps {}

export class PointlessScreen extends React.Component<TodoListProps, void> {
  static navigationOptions = {
    title: "صفحه‌ی بی‌خاصیت",
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Button onPress={() => this.playAudio()}>
          <Text>پخش فایل صوتی</Text>
        </Button>
      </View>
    );
  }

  loadAudio() {}

  playAudio() {
    let sampleAudio = new Sound('SampleAudio.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // loaded successfully
      sampleAudio.play();    
    });
  }
}
