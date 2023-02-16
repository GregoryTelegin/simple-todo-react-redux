import {createBrowserRouter} from "react-router-dom";
import React from "react";
import TodosLists from "../components/TodosLists";
import Todo from '../components/Todo'
const router = createBrowserRouter([
    {
        path: "/",
        element: <TodosLists/>,
    },
    {
        path: "/:id",
        element: <Todo/>,
    },
]);

export default router;