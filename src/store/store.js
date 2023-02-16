import {configureStore} from '@reduxjs/toolkit';

import todoReducer from "../features/todo/todo";
import todosListsReducer from "../features/todosLists/todosLists";

const store = configureStore({
    reducer: {
        todo: todoReducer,
        todosLists: todosListsReducer,
    }
})

export default store;