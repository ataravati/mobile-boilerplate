import React from "react";
import { Text, View } from "native-base";

export class PointlessScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>I'm so worthless</Text>
      </View>
    );
  }
}
