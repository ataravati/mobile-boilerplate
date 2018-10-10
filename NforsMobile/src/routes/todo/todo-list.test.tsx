import React from "react";
import renderer from "react-test-renderer";
import { mount, ReactWrapper } from "enzyme";
import { Provider } from "mobx-react";
import { Text, View } from "native-base";

import { TodoItem, TodoList } from "./todo-list";
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

  /**
   * Example usage of Enzyme.
   *
   * There are definite limitations to Enzyme that I haven't
   * been able to work around. It is usable, but it can be difficult
   * to find data after the fact and verify results.
   *
   * Sometimes Enzyme allows you to select by a JavaScript class,
   * like a Component. But it doesn't seem to allow that after initial
   * render. And since you can't use className with React Native, it can
   * be hard to find() the elements you care about.
   */
  it("can add a Todo with Enzyme", () => {
    const wrapper: ReactWrapper = mount(
      <Provider todoStore={todoStore}>
        <TodoList />
      </Provider>,
    );

    const input: any = wrapper.find("Input").first();
    const addTodoButton = wrapper
      .find("Button")
      .findWhere(w => w.text() === "Add Todo")
      .first();

    input.props().onChangeText("Foo");
    addTodoButton.props().onPress();

    const domText = wrapper
      .findWhere(w => {
        return !!w.text() && w.text().startsWith("Todo: Foo");
      })
      .first();
    expect(domText).toExist();
  });
});
