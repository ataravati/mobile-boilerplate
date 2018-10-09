import { destroy, types, onSnapshot } from "mobx-state-tree";

export const Todo = types
  .model("Todo", {
    title: types.string,
    done: false,
  })
  .actions(self => ({
    toggle() {
      self.done = !self.done;
    },
  }));

const TodoStoreModel = types
  .model("TodoStore", {
    todos: types.array(Todo),
  })
  .actions(self => ({
    addTodo(text: string) {
      self.todos.push({
        title: text,
        done: false,
      } as typeof Todo.Type);
    },
    destroyTodo(todo: typeof Todo.Type) {
      destroy(todo);
    },
  }));

export const todoStore = TodoStoreModel.create({
  todos: [],
});

onSnapshot(todoStore, snapshot => {
  console.log(snapshot);
});

export type TodoStore = typeof TodoStoreModel.Type;
