import React from "react";
import { Button, Text } from "native-base";

const SpeedControl = ({
  value,
  onChange,
}: {
  value: number;
  onChange(value: number): void;
}) => {
  const newValue = value < 2 ? value + 0.5 : 1;

  return (
    <Button transparent onPress={() => onChange(newValue)}>
      <Text>{value}x</Text>
    </Button>
  );
};

export default SpeedControl;
