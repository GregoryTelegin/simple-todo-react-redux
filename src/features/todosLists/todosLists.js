import { createSlice } from '@reduxjs/toolkit'
import {v4 as uuidv4} from "uuid";
import axios from "axios";

const todosList = []

export const todosLists = createSlice({
    name: 'todosLists',
    initialState: {
        todosList,
    },
    reducers: {
        createTodosList: (todosList, data) => {
            const newTodosList = {...data.payload}
            axios.post('http://localhost:9999/todosLists', {
                ...newTodosList
            });
        },
        deleteTodosList: (todosList, data) => {
            const id = data.payload.id
            axios.delete(`http://localhost:9999/todosLists/${id}`);
        },
        updateTodosList: (todosList, data) => {
            let id = data.payload.id;
            let newTodosLists = data.payload;
            axios.put(`http://localhost:9999/todosLists/${id}`, {
                ...newTodosLists
            });
        },
    },
})

export const { createTodosList, deleteTodosList, updateTodosList } = todosLists.actions

export default todosLists.reducer