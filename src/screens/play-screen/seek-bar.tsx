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

const SeekBar = ({
  duration,
  currentTime,
  onSeek,
  onSeekStart,
  onSeekEnd,
}: {
  duration: number;
  currentTime: number;
  onSeek(value: number): void;
  onSeekStart(): void;
  onSeekEnd(): void;
}) => {
  const elapsed = formatTime(Math.floor(currentTime));
  const remaining = formatTime(Math.floor(currentTime) - Math.floor(duration));

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
        onResponderStart={() => onSeekStart()}
        onResponderRelease={() => onSeekEnd()}
        onSlidingComplete={(value: number) => onSeek(value)}
      />
    </View>
  );
};

export default SeekBar;
