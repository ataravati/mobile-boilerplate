import React from "react";
import { View, Text } from "native-base";
import { Slider } from "react-native";

const formatTime = (time: number) => {
  let result = time < 0 ? "-" : "";
  time = Math.abs(time);
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);

  if (hours > 0) result += hours + ":";

  result += padZero(minutes) + ":" + padZero(seconds);

  return result;
};

const padZero = (number: number) => {
  if (number < 10) return "0" + number;
  return number;
};

const SeekBar = ({ duration, currentTime, onSeek, onSeekStart, onSeekEnd }) => {
  const elapsed = formatTime(currentTime);
  const remaining = formatTime(currentTime - duration);
  return (
    <View>
      <View style={{ flexDirection: "row" }}>
        <Text>Remaining: {remaining}</Text>
        <Text style={{ marginStart: 20 }}>Elapsed: {elapsed}</Text>
      </View>
      <Slider
        style={{ direction: "ltr", marginTop: 10 }}
        maximumValue={Math.max(1, duration, currentTime)}
        value={currentTime}
        onResponderMove={() => onSeekStart()}
        onResponderRelease={() => onSeekEnd()}
        onSlidingComplete={value => onSeek(value)}
      />
    </View>
  );
};

export default SeekBar;
