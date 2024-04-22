import {create} from "../../framework/framework.js";

type LinkProps = {
    href: string
    text:  string
}
function Link({href, text}: LinkProps) {

    const currentHref = document.URL.split("#")[1]

    const activeClasses = href == currentHref ? "bg-blue-500 text-white border-none rounded-lg " : ""


    return create("a", { href: `#${href}`, class: `py-1 px-4 font-light text-md font-bold border-b rounded-lg border-slate-300 text-slate-700 hover:text-white hover:bg-slate-500 hover:border-transparent duration-200 ${activeClasses}` }, text)
}

export default Link