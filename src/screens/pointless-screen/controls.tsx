import React from "react";
import { View, Button, Icon } from "native-base";
import { Slider } from "react-native";

const Controls = ({ paused, volume, onPressPlay, onVolumeChange }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Slider
        style={{ direction: "ltr", width: 200, marginLeft: 20 }}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onSlidingComplete={value => onVolumeChange(value)}
      />
      <Button onPress={() => onPressPlay()}>
        <Icon name={paused === true ? "play" : "pause"} />
      </Button>
    </View>
  );
};

export default Controls;
