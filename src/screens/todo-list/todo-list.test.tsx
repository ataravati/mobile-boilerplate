import React from "react";
import renderer from "react-test-renderer";
import { createStackNavigator } from "react-navigation";
import { mount, ReactWrapper } from "enzyme";
import { Provider } from "mobx-react";
import { Text } from "native-base";

import { TodoItem } from "./todo-item";
import { TodoList } from "./todo-list";
import { todoStore } from "../../stores/todo-store";
import console = require("console");

// https://github.com/react-navigation/react-navigation/issues/2269
// React Navigation generates random React keys, which makes
// snapshot testing fail. Mock the randomness to keep from failing.
jest.mock("react-navigation/src/routers/KeyGenerator", () => ({
  generateKey: jest.fn(() => 123),
}));

const routes = (routeConfigMap, initialRouteName) => {
  const Router = createStackNavigator(routeConfigMap, {
    initialRouteName,
  });

  return (
    <Provider keyLength={0} todoStore={todoStore}>
      <Router />
    </Provider>
  );
};

describe("todo-list", () => {
  /**
   * Example usage of Jest Snapshot testing.
   *
   * To update tests, run the tests but use the -u flag, optionally specifying the test file name:
   *
   * > $ yarn test -u "todo-list"
   * or
   * > $ yarn test -u --testNamePattern "todo-list"
   *
   * Where the pattern matches the describe you want to test/update snapshots for.
   */
  it("can render snapshot", () => {
    const tree = renderer
      .create(
        routes(
          {
            TodoList,
          },
          "TodoList",
        ),
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe("enzyme tests", () => {
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
    xit("can add a Todo with Enzyme", () => {
      const wrapper: ReactWrapper = mount(
        routes(
          {
            TodoList,
          },
          "TodoList",
        ),
      );

      const newTodoText = "I need to do something...";
      const newTodoTextInput: any = wrapper.find("Input").first();
      const addTodoButton = wrapper
        .find("Button")
        .findWhere(w => w.text() === "Add Todo")
        .first();

      newTodoTextInput.props().onChangeText(newTodoText);

      // Enzyme usually allows wrapper.simulate() alternatively, but this doesn't support "press" events.
      addTodoButton.props().onPress();

      // Make sure to call update if external events (e.g. Mobx state changes)
      // result in updating the component props.
      wrapper.update();

      // You can test your components by inspecting the component tree, text stripped from html, or html itself:
      console.log();
      console.log("wrapper.debug()");
      console.log("---------------");
      console.log(wrapper.debug());
      console.log();
      console.log("wrapper.text()");
      console.log("---------------");
      console.log(wrapper.text());
      console.log();
      console.log("wrapper.html()");
      console.log("---------------");
      console.log(wrapper.html());

      // You can either check for a testID prop, similar to className in React:
      expect(
        wrapper.findWhere(node => node.prop("testID") === "todo-item"),
      ).toExist();

      // Or even just find a component itself, if you broke the JSX out into its own component:
      expect(wrapper.find(TodoItem)).toExist();

      // You can also search by the component name.
      // But your component needs to be a class or a standard function.
      // Arrow functions will have a name of "Component", as they are unnamed in JavaScript.
      expect(wrapper.find("TodoItem")).toExist();

      // You can also inspect the found item.
      // The found item is itself a wrapper, so you can look at e.g. props(), text(), html(), etc.
      expect(
        wrapper
          .find(TodoItem)
          .first()
          .findWhere(node => node.prop("testID") === "todo-title")
          // Enzyme wrappers contain both actual mounted DOM along with components. When we want to inspect the DOM we therefore have to call hostNodes, or you will get multiple matches per DOM node (DOM + its component):
          // https://www.bountysource.com/issues/49797654-enzyme-3-0-0-find-queries-not-just-dom-elements
          .hostNodes()
          .text(),
      ).toEqual(newTodoText);

      // You can render a component you expect to be similar to one found in the wrapper
      expect(
        wrapper.containsMatchingElement(<Text>{newTodoText}</Text>),
      ).toBeTruthy();

      // You can even do snapshot testing,
      // if you pull in enzyme-to-json and configure
      // it in snapshotSerializers in package.json
      expect(wrapper.find(TodoList)).toMatchSnapshot();
    });
  });
});
