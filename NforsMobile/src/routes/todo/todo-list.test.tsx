import React from "react";
import renderer from "react-test-renderer";
import { mount, ReactWrapper } from "enzyme";
import { Provider } from "mobx-react";
import { View } from "native-base";

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

  // it("can render at least one Button", () => {
  //   const wrapper: ReactWrapper = mount(
  //     <Provider todoStore={todoStore}>
  //       <TodoList />
  //     </Provider>,
  //   );

  //   const input: any = wrapper.find("Input").first();
  //   const addTodoButton = wrapper
  //     .find("Button")
  //     .findWhere(w => w.text() === "Add Todo")
  //     .first();

  //   console.log(wrapper.find("View"));
  //   input.props().onChangeText("Foo");
  //   addTodoButton.props().onPress();

  //   const domText = wrapper
  //     .findWhere(w => !!w.text() && w.text().includes("Foo"))
  //     .first();
  //   expect(domText).toExist();
  // });
});
