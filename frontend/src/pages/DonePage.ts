import {TodoList} from "../components/TodoList.js";
import Division from "../components/ui/Division.js";

const DonePage = () => {
    return Division({
        class:"w-full min-h-screen bg-slate-200",
            children:[
                TodoList({filter:"done"}),
            ]
        },
    )
};



export default DonePage;