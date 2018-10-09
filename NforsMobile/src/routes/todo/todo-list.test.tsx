import React from "react";
import renderer from "react-test-renderer";
import { Provider } from "mobx-react";

import { TodoList } from "./todo-list";
import { todoStore } from "../../stores/todo-store";

describe("todo-list", () => {
  it("can render snapshot", () => {
    const tree = renderer
      .create(
        <Provider todoStore={todoStore}>
          <TodoList />
        </Provider>,
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it("can render", () => {
    const tree = renderer
      .create(
        <Provider todoStore={todoStore}>
          <TodoList />
        </Provider>,
      )
      .toJSON();
  });
});
