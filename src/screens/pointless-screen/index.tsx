import React from "react";
import { Text, View } from "native-base";

interface TodoListProps {}

export class PointlessScreen extends React.Component<TodoListProps, void> {
  static navigationOptions = {
    title: "Pointless Screen",
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>I'm so worthless</Text>
      </View>
    );
  }
}
