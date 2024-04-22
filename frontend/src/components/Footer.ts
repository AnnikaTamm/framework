import Link from "./ui/Link.js";
import Division from "./ui/Division.js";

const Footer = () => {
  return Division(
    { variant:"row", class: "col-span-3 col-start-2 gap-4 justify-center",
    children: [
      Link({href: "", text: "View all tasks"}),
      Link({href: "Done", text: "Completed tasks"}),
      Link({href: "Active", text: "Active tasks"}),
    ]},
  );
};

export default Footer;
