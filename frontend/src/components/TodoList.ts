import { ComponentHooks } from "../framework/state.js";
import { Todo } from "./Todo.js";
import { TodoForm } from "./TodoForm.js";
import { TodoItem } from "../lib/types.js";
import Button from "./ui/Button.js";
import Division from "./ui/Division.js";
import Footer from "./Footer.js";
import { create } from "../framework/framework.js";

type TodoListProps = {
  filter?: string;
};
export const TodoList = ({ filter = "all" }: TodoListProps) => {
  const { useState } = ComponentHooks("TodoList");
  const [todos, setTodos] = useState<TodoItem[]>([]);

  const addTodo = (todo: TodoItem) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      return;
    }

    const newTodos = [todo, ...todos];
    setTodos(newTodos);
    console.log(todo.isComplete, todo, ...todos);
  };
  const updateTodo = (updatedTodo: TodoItem) => {
    if (!updatedTodo.text || /^\s*$/.test(updatedTodo.text)) {
      return;
    }

    setTodos((prev) =>
      prev.map((item) => (item.id === updatedTodo.id ? updatedTodo : item))
    );
  };

  const removeTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const removeCompleteTodo = () => {
    setTodos((prev) => prev.filter((todo) => todo.isComplete === false));
  };

  const completeTodo = (id: number) => {
    // Add a colon after the parameter type declaration
    let updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        todo.isComplete = !todo.isComplete;
        console.log(todo.isComplete, todo.text);
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    switch (filter) {
      case "done":
        return todo.isComplete;
      case "active":
        return !todo.isComplete;
      default:
        return true;
    }
  });
  const activeCount = todos.filter((todo) => !todo.isComplete).length;

  const activeCountLabel = create(
    "label",
    {
      class: "text-xl font-bold p-2",
      key: "active-count-label",
    },
    `Active tasks: ${activeCount}`
  );

  return Division({
    class: " grid grid-cols-5 ",
    children: [
      Division({
        class: "col-span-3 col-start-2 mt-16 bg-white border shadow-lg",

        children: [
          Division({
            variant: "row",
            class:
              "p-4 font-sans font-light text-3xl tracking-widest justify-center",
            children: [
              create(
                "p",
                { class: "font-thin text-6xl text-gray-400", children: [] },
                "todos"
              ),
            ],
          }),
          // Division({ class: "p-4 font-sans font-light italic text-sm tracking-wide text-gray-500", children: "Create your to-do-list!" }),
          Division({
            class: "p-4 ",
            children: TodoForm({ onSubmit: addTodo }),
          }),
          Division({
            class: "p-4 col-span-3 col-start-2 ",
            children: filteredTodos.map((todo) =>
              Todo({
                todo,
                completeTodo,
                removeTodo,
                updateTodo,
                removeCompleteTodo,
              })
            ),
          }),
          Division({
            class: "p-4  justify-center",
            children: Button({
              class: "rounded-sm w-full",
              text: "Clear all done tasks",
              onClick: () => removeCompleteTodo(),
            }),
          }),
          Division({ class: "p-4 ", children: Footer() }),
          Division({ class: "p-4 ", children: activeCountLabel }),

          ,
        ],
      }),
    ],
  });
};