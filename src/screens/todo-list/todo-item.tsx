import React from "react";
import { StyleSheet } from "react-native";

import { Button, Text, View } from "native-base";

export function TodoItem({ destroyTodo, key, todo }) {
  return (
    <View key={key} style={styles.todo} testID="todo-item">
      <Text testID="todo-title" style={styles.title}>
        {todo.title}
      </Text>
      <Button onPress={() => destroyTodo(todo)}>
        <Text>حذف</Text>
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    maxWidth: "70%",
    writingDirection: "rtl"
  },
  todo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
});
