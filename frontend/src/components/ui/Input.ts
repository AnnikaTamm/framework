import { create } from "../../framework/framework.js";

interface InputProps {
    type: string;
    placeholder?: string;
    value?: string;
    class?: string;
    name?: string;
    onChange?: (e: Event) => void;
    autofocus?: boolean;
    checked?: boolean
}

function Input({
                   type,
                   placeholder,
                   value,
                   class: className = "",
                   name,
                   onChange,
                   autofocus = false,
                   checked
               }: InputProps) {
    let baseStyle = "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm  block w-full px-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white ";



    const combinedClasses = `${baseStyle} ${className}`;

    return create("input", {
        type,
        placeholder,
        value,
        class: combinedClasses,
        name,
        onChange,
        autofocus,
        checked // This prop is only relevant for checkboxes
    });
}

export default Input;
