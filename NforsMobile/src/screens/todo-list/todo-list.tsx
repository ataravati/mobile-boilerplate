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
import { TodoItem } from "./todo-item";
import { createStackNavigator } from "react-navigation";

import { TodoStore, Todo } from "../../stores/todo-store";

interface TodoListProps {
  todoStore?: TodoStore;
}

interface TodoListState {
  newTodoText: string;
}

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
class TodoListComponent extends React.Component<TodoListProps, TodoListState> {
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
              <Button
                full
                onPress={() =>
                  this.props.navigation.navigate("PointlessScreen")
                }
              >
                <Text>Go to a pointless screen</Text>
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
});

export const TodoList = createStackNavigator({
  TodoList: {
    screen: TodoListComponent,
  },
});
