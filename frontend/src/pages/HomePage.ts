import { TodoList } from "../components/TodoList.js";
import Division from "../components/ui/Division.js";


const HomePage = () => {
  return Division({
    class:"w-full min-h-screen bg-slate-200",
    children:[
      TodoList({}),
    ]
      },
  )
};

export default HomePage;
