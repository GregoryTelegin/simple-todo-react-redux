import { createSlice } from '@reduxjs/toolkit'
import {v4 as uuidv4} from "uuid";
import axios from "axios";

const todos = []

export const todosLists = createSlice({
    name: 'todosLists',
    initialState: {
        todos,
    },
    reducers: {
        createTodo: (todos, data) => {
            console.log(data)
            const id = data.payload.selectedTodos.id
            const todosList = {...data.payload.selectedTodos};
            const newTodo = {...data.payload.newTodo};
            todosList.todos.push(newTodo)
            axios.put(`http://localhost:9999/todosLists/${id}`, {
                ...todosList
            });
        },
        deleteTodo: (todos, data) => {
            console.log(data)
            const id = data.payload.selectedTodos.id
            const todosList = {...data.payload.selectedTodos}
            todosList.todos.map((todo, index) => {
                if (todo.id === data.payload.id) {
                    todosList.todos.splice(index, 1)
                }
            })
            console.log(todosList)
            axios.put(`http://localhost:9999/todosLists/${id}`, {
                ...todosList
            });
        },
        updateTodo: (todos, data) => {
            const selectedTodosList = data.payload.selectedTodos
            const updatedTodo = data.payload.list
            selectedTodosList.todos.splice(data.payload.index, 1, updatedTodo)
            axios.put(`http://localhost:9999/todosLists/${selectedTodosList.id}`, {
                ...selectedTodosList
            });
        },
        completeTodo: (todos, data) => {
            const selectedTodosList = data.payload.selectedTodos
            const updatedTodo = data.payload.list
            updatedTodo.completed = !updatedTodo.completed
            selectedTodosList.todos.splice(data.payload.index, 1, updatedTodo)
            axios.put(`http://localhost:9999/todosLists/${selectedTodosList.id}`, {
                ...selectedTodosList
            });
        },
    },
})

export const { createTodo, deleteTodo, updateTodo, completeTodo } = todosLists.actions

export default todosLists.reducer