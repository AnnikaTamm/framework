import { create } from "../framework/framework.js";
import { ComponentHooks } from "../framework/state.js";
import { TodoItem } from "../lib/types.js";
import Button from "./ui/Button.js";
import Input from "./ui/Input.js";
import Division from "./ui/Division.js";


interface TodoProps {
  todo: { id: number; text: string; isComplete: boolean };
  completeTodo: any;
  removeTodo: any;
  removeCompleteTodo: any;
  updateTodo: TodoUpdate;
}

type TodoUpdate = (updatedTodo: TodoItem) => void;

export const Todo = ({
  todo,
  completeTodo,
  removeTodo,
  updateTodo,
}: TodoProps) => {
  const {useState} = ComponentHooks("Todo" + todo.id);

  const [edit, setEdit] = useState(false);

  if (edit) {
    return EditTodo({Todo: todo, updateTodo: updateTodo, setEdit: setEdit});
  }


  return Division({
    variant: "row",
    class: "flex p-2 items-center border border-gray-300 rounded-sm", // Add `flex-row` for clarity and `gap-2` for spacing between items
    children: [
      Button({
        onClick: () => completeTodo(todo.id),
        text: "✓",
        checked: todo.isComplete,
        class:`mr-2 rounded-full ${todo.isComplete ? "" : "text-transparent border rounded-full"}`
      } ),
      create(
          "label",
          {
            class: ` text-gray-500 p-2 text-xl ${todo.isComplete ? "line-through text-gray-400 font-extralight italic" : ""} mr-4 flex-grow`, // Add `flex-grow` to make label flexible and `mr-4` for margin, removed for using gap
            key: todo.id,
            onClick: () => setEdit((prev) => !prev)
          },
          todo.text
      ),



      Button({
        onClick: () => removeTodo(todo.id),
        text: "×",
        class:"border-none hover:bg-gray-100/50 p-2 rounded-xl"
      }),
    ]
  })

}


type EditTodoProps = {
  Todo: TodoItem;
  updateTodo: TodoUpdate;
  setEdit: (value: boolean) => void;
};

function EditTodo({ Todo, updateTodo, setEdit }: EditTodoProps) {
  const { useState } = ComponentHooks("EditTodo" + Todo.id);

  const [input, setInput] = useState(Todo.text);

  const handleSubmit = (e: FormDataEvent) => {
    e.preventDefault();

    if (!input || /^\s*$/.test(input)) {
      return;
    }

    Todo = {
      ...Todo,
      text: input,
    };

    updateTodo(Todo);
    setEdit(false);
  };

  return create(
          "form",
          {
            class: "flex flex-row mb-2 ",
            onSubmit: handleSubmit, // Pass the handleSubmit function correctly
          },
          Input({
            class: "flex-grow text-slate-500 p-2 text-xl rounded-sm",
            type: "text",
            placeholder: "Edit your item...",
            value: input,
            onChange: (e: Event) => {
              const target = e.target as HTMLInputElement | null;
              if (target) {
                setInput(target.value);
              }
            },
          }),

          Button({ onClick: ()=> handleSubmit, text: "Update", class:"ml-2 flex grow w-1/5 items-center justify-center" })
      )


}
