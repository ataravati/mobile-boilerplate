import React from "react";
import { View, Button, Text } from "native-base";

const Controls = ({ paused, onPressPlay }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Button onPress={() => onPressPlay()}>
        <Text>{paused === true ? "Play" : "Pause"}</Text>
      </Button>
    </View>
  );
};

export default Controls;
