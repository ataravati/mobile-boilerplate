import { todoStore, Todo } from "./todo-store";

describe("todo-store", () => {
  it("can add a todo", () => {
    todoStore.addTodo("foo");
    expect(todoStore.todos.slice()).toEqual([
      { title: "foo", done: false },
    ] as typeof Todo.Type[]);
  });
});
