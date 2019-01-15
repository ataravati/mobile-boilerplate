import React from "react";
import { View, Button, Icon } from "native-base";
import { Slider, Platform } from "react-native";
import SpeedControl from "./speed-control";

const Controls = ({
  paused,
  volume,
  speed,
  onPressPlay,
  onForward,
  onRewind,
  onVolumeChange,
  onSpeedChange,
}: {
  paused: boolean;
  volume: number;
  speed: number;
  onPressPlay(): void;
  onForward(): void;
  onRewind(): void;
  onVolumeChange(value: number): void;
  onSpeedChange(value: number): void;
}) => {
  const playIcon = Platform.OS === "ios" ? "ios-play" : "play";
  const pauseIcon = Platform.OS === "ios" ? "ios-pause" : "pause";
  return (
    <View>
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
          onSlidingComplete={(value: number) => onVolumeChange(value)}
        />
        <SpeedControl
          value={speed}
          onChange={(value: number) => onSpeedChange(value)}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Button transparent onPress={() => onForward()}>
          <Icon
            name={Platform.OS === "ios" ? "ios-fastforward" : "fastforward"}
          />
        </Button>
        <Button transparent onPress={() => onPressPlay()}>
          <Icon name={paused === true ? playIcon : pauseIcon} />
        </Button>
        <Button transparent onPress={() => onRewind()}>
          <Icon name={Platform.OS === "ios" ? "ios-rewind" : "rewind"} />
        </Button>
      </View>
    </View>
  );
};

export default Controls;
