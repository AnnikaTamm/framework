import { ComponentHooks } from "../framework/state.js";
import Button from "./ui/Button.js";
import Input from "./ui/Input.js";
import Division from "./ui/Division.js";

interface TodoFormProps {
  edit?: any;
  onSubmit: any;
}

export const TodoForm = (props: TodoFormProps) => {
  const { useState } = ComponentHooks("TodoForm");
  const [input, setInput] = useState(props.edit ? props.edit.value : "");

  const handleChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    setInput(target.value);
  };

  const handleSubmit = (e: Event) => {
    e.preventDefault();

    props.onSubmit({
      id: Math.floor(Math.random() * 10000),
      text: input,
      isComplete: false,
    });
    setInput("");
  };

  return Division({
    variant: "row",
    class: "",
    children: props.edit
        ? [
          Input({
            type: "text",
            placeholder: "Update your item",
            value: input,
            name: "text",
            class: "flex-grow mr-2 rounded-sm ",
            onChange: handleChange,
          })
        ]
        : [
          Input({
            type: "text",
            placeholder: "Add a task...",
            class:"",
            value: input,
            name: "text",
            onChange: handleChange,
            autofocus: true,
          }),
          Button({
            onClick: handleSubmit,
            text: "Add new task",
            class:"ml-2 flex grow w-1/5 items-center justify-center rounded-sm"
          })
        ]
  }
  );
};
