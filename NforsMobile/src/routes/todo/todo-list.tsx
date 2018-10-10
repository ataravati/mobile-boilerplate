import React from "react";
import { inject, observer } from "mobx-react/native";
import {
  Button,
  Container,
  Content,
  Footer,
  Form,
  Header,
  Icon,
  Input,
  Item,
  Text,
  View,
} from "native-base";
import { StyleSheet } from "react-native";

import { TodoStore, Todo } from "../../stores/todo-store";

interface TodoListProps {
  todoStore?: TodoStore;
}

interface TodoListState {
  newTodoText: string;
}

export const TodoItem = ({ destroyTodo, key, todo }) => (
  <View key={key} style={styles.todo}>
    <Text>{todo.title}</Text>
    <Text>{todo.done}</Text>
    <View>
      <Button onPress={() => destroyTodo(todo)}>
        <Text>Delete</Text>
      </Button>
    </View>
  </View>
);

const TodoItems = ({
  destroyTodo,
  todos,
}: {
  destroyTodo: (todo: typeof Todo.Type) => void;
  todos: typeof Todo.Type[];
}) => {
  return (
    <View style={styles.todos}>
      {todos.map((todo: typeof Todo.Type, index: number) => (
        <TodoItem destroyTodo={destroyTodo} key={index} todo={todo} />
      ))}
    </View>
  );
};

@inject("todoStore")
@observer
export class TodoList extends React.Component<TodoListProps, TodoListState> {
  state = {
    newTodoText: "",
  };

  destroyTodo = (todo: typeof Todo.Type) => {
    this.props.todoStore!.destroyTodo(todo);
  };

  addTodo = (text: string) => {
    this.props.todoStore!.addTodo(text);
  };

  render() {
    return (
      <Container>
        <Header />
        <Content>
          <TodoItems
            todos={this.props.todoStore!.todos.slice()}
            destroyTodo={this.destroyTodo}
          />
          <View style={styles.newTodo}>
            <View>
              <Form>
                <Item>
                  <Icon active name="create" />
                  <Input
                    placeholder="New Todo..."
                    onChangeText={text => this.setState({ newTodoText: text })}
                    value={this.state.newTodoText || ""}
                  />
                </Item>
              </Form>
              <Button
                full
                onPress={() => {
                  this.addTodo(this.state.newTodoText);
                  this.setState({
                    newTodoText: "",
                  });
                }}
              >
                <Text>Add Todo</Text>
              </Button>
            </View>
          </View>
        </Content>
        <Footer />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
  },
  content: {
    margin: 10,
    flex: 1,
    flexDirection: "column",
  },
  newTodo: {
    flex: 1,
  },
  todos: {
    flex: 3,
    flexDirection: "column",
  },
  todo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
});
