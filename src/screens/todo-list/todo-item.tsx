import React from "react";
import { StyleSheet } from "react-native";

import { Button, Text, View } from "native-base";

export function TodoItem({ destroyTodo, key, todo }) {
  return (
    <View key={key} style={styles.todo} testID="todo-item">
      <Text testID="todo-title">{todo.title}</Text>
      <Text testID="todo-completed">{todo.completed}</Text>
      <View>
        <Button onPress={() => destroyTodo(todo)}>
          <Text>Delete</Text>
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  todo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
});
