import { create } from "../../framework/framework.js";

type ButtonProps = {
    onClick?: (e: Event) => void;
    text?: string;
    class?: string;
    checked?: boolean;
}

function Button({ onClick, text, class: className = "", checked = false }: ButtonProps) {
    const activeClasses = checked ? " py-1 px-2.5 rounded-full text-green-700 text-3xl" : " py-1.5 px-2.5 text-sm font-medium text-gray-900 focus:outline-none bg-white  border border-gray-200 hover:bg-gray-100 hover:text-blue-700  dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700";
    const buttonClasses = ` ${activeClasses} ${className}`;

    return create("button", { onClick, class: buttonClasses }, text);
}

export default Button;
