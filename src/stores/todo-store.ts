import { destroy, flow, types, onSnapshot } from "mobx-state-tree";

import { fakeApi } from "../apis/fake-api";

export const Todo = types
  .model("Todo", {
    title: types.string,
    completed: false,
  })
  .actions(self => ({
    toggle() {
      self.completed = !self.completed;
    },
  }));

const TodoStoreModel = types
  .model("TodoStore", {
    isLoading: types.boolean,
    todos: types.array(Todo),
  })
  .actions(self => ({
    fetchTodos: flow(function*() {
      self.isLoading = true;
      const response = yield fakeApi.get("/todos");
      self.isLoading = false;
      self.todos.replace(response.data.slice(0, 10));
    }),
    addTodo(text: string) {
      self.todos.push({
        title: text,
        completed: false,
      } as typeof Todo.Type);
    },
    destroyTodo(todo: typeof Todo.Type) {
      destroy(todo);
    },
  }));

export const todoStore = TodoStoreModel.create({
  isLoading: false,
  todos: [],
});

onSnapshot(todoStore, snapshot => {
  console.log("snapshot:", snapshot);
});

export type TodoStore = typeof TodoStoreModel.Type;
