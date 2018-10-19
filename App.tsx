import React, { Component } from "react";
import { Provider } from "mobx-react";
import { createStackNavigator } from "react-navigation";

import { todoStore } from "./src/stores/todo-store";
import { PointlessScreen } from "./src/screens/pointless-screen";
import { TodoList } from "./src/screens/todo-list";

const Router = createStackNavigator(
  {
    PointlessScreen,
    TodoList,
  },
  {
    initialRouteName: "TodoList",
  },
);

type Props = {};
export default class App extends Component<Props> {
  render() {
    return (
      <Provider todoStore={todoStore}>
        <Router />
      </Provider>
    );
  }
}
