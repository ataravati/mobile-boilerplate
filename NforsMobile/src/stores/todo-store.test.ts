import { todoStore, Todo } from "./todo-store";

describe("clear", () => {
  xit("can", () => {
    todoStore.addTodo("foo");
    expect(todoStore.todos.slice()).toEqual([
      { title: "foo", done: false },
    ] as typeof Todo.Type[]);
  });
});
