import React from "react";
import { inject, observer } from "mobx-react/native";
import {
  Body,
  Button,
  Container,
  Content,
  Footer,
  Header,
  Icon,
  Input,
  Item,
  Spinner,
  Text,
} from "native-base";
import { ScrollView, StyleSheet } from "react-native";
import { TodoItem } from "./todo-item";
import { NavigationScreenProp, NavigationState } from "react-navigation";

import { TodoStore, Todo } from "../../stores/todo-store";

interface TodoListProps {
  navigation: NavigationScreenProp<NavigationState>;
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
    <ScrollView style={styles.todos}>
      {todos.map((todo: typeof Todo.Type, index: number) => (
        <TodoItem destroyTodo={destroyTodo} key={index} todo={todo} />
      ))}
    </ScrollView>
  );
};

@inject("todoStore")
@observer
export class TodoList extends React.Component<TodoListProps, TodoListState> {
  state = {
    newTodoText: "",
  };

  static navigationOptions = {
    title: "Todo List",
  };

  destroyTodo = (todo: typeof Todo.Type) => {
    this.props.todoStore!.destroyTodo(todo);
  };

  addTodo = (text: string) => {
    this.props.todoStore!.addTodo(text);
  };

  fetchTodos = () => {
    this.props.todoStore!.fetchTodos();
  };

  render() {
    return (
      <Container>
        <Header style={{ backgroundColor: "white" }}>
          <Body style={{ flexDirection: "row" }}>
            <Item regular style={{ flex: 1, flexGrow: 4 }}>
              <Icon name="create" />
              <Input
                onChangeText={text => this.setState({ newTodoText: text })}
                value={this.state.newTodoText || ""}
              />
            </Item>
            <Button
              transparent
              style={{ flexGrow: 0 }}
              onPress={() => {
                this.addTodo(this.state.newTodoText);
                this.setState({
                  newTodoText: "",
                });
              }}
            >
              <Text>Add Todo</Text>
            </Button>
          </Body>
        </Header>
        <Content style={{ flex: 1 }}>
          {this.props.todoStore!.isLoading ? (
            <Spinner />
          ) : (
            <TodoItems
              todos={this.props.todoStore!.todos.slice()}
              destroyTodo={this.destroyTodo}
            />
          )}
        </Content>
        <Footer style={{ flexDirection: "column", height: 100 }}>
          <Button
            full
            onPress={() => {
              this.fetchTodos();
            }}
          >
            <Text>Fetch Example Todos From API</Text>
          </Button>
          <Button
            full
            onPress={() => this.props.navigation.push("NestedPointlessScreen")}
          >
            <Text>Go to a pointless screen</Text>
          </Button>
        </Footer>
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
  newTodoInput: {
    flexGrow: 1,
  },
  todos: {
    flex: 3,
    flexDirection: "column",
    width: "100%",
  },
});
