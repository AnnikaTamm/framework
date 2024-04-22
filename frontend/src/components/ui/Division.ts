import { create } from "../../framework/framework.js";

interface DivisionProps {
    class?: string;
    children: any;
    variant?: 'column' | 'row'; // Adding a variant prop to switch between column and row layouts
}

function Division({ class: className = "", children, variant = "column" }: DivisionProps) {
    // Default classes are set for a column layout
    const baseClasses = "";
    const variantClasses = variant === "row" ? "flex flex-row" : "flex-col";
    const combinedClasses = `${baseClasses} ${variantClasses} ${className}`;

    return create("div", { class: combinedClasses }, children);
}

export default Division;
