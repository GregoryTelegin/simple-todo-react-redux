import {useState, useEffect} from "react";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useDispatch} from "react-redux";
import {NavLink, useLocation} from "react-router-dom";

import {ButtonShowFormCreateTodosLists, FormCreateTodosList} from "../shared";
import '../styles/Todo.css';
import {createTodo, updateTodo, deleteTodo, completeTodo } from "../features/todo/todo";
import {v4 as uuidv4} from "uuid";

let newTodo = {
    id: null,
    title: null,
    editable: false,
    completed: false,
    priority: '0',
};

function Todo() {
    const location = useLocation();
    const dispatch = useDispatch();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedTodos, setSelectedTodos] = useState([]);
    const [todos, setTodos] = useState([]);
    const [load, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:9999/todosLists').then(res => {
            console.log(res.data)
            res.data.map((todosLists) => {
                if (todosLists.id === location.pathname.split('/')[1]) {
                    const selectedTodosList = {...todosLists};
                    setTodos(selectedTodosList.todos)
                    setSelectedTodos(selectedTodosList)
                }
            })

        })
        setLoading(false);
    }, [setSelectedTodos])

    const selectedFilterForTodos = (e) => {
        setSelectedFilter(e.target.value)
    }

    const handleChange = (e) => {
        newTodo[e.target.name] = e.target.value;
    }
    const showFormCreateTodos = () => {
        setShowForm(true)
    };
    const createNewTodo = (e, newTodo) => {
        e.preventDefault()
        newTodo.id = uuidv4()
        dispatch(createTodo({newTodo, selectedTodos}))
        setSelectedTodos(selectedTodos)
        newTodo = {
            id: null,
            title: null,
            editable: false,
            completed: false,
            priority: '0',
        };
        setShowForm(false)
    };
    const editingTodo = (e, id) => {
        for (let index = 0; index < selectedTodos.todos.length; index++) {
            if (selectedTodos.todos[index].id === id) {
                const updatedTodosLists = selectedTodos;
                console.log(updatedTodosLists.todos[index].editable)
                updatedTodosLists.todos[index].editable = true;
                setSelectedTodos({...updatedTodosLists})
            }
        }
    }
    const removeTodo = (e, id) => {
        dispatch(deleteTodo({id, selectedTodos}))
        setSelectedTodos({...selectedTodos})
    };

    const updatedTodo = (e, list) => {
        for (let index = 0; index < selectedTodos.todos.length; index++) {
            if (selectedTodos.todos[index].id === list.id) {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    list.title = e.target.value;
                    list.editable = false;
                    dispatch(updateTodo({list, selectedTodos, index}))
                    selectedTodos.todos.splice(index, 1, list)
                    selectedTodos.todos[index].editable = false;
                    setSelectedTodos({...selectedTodos})
                } else if (e.key === 'Escape') {
                    selectedTodos.todos[index].editable = false;
                    setSelectedTodos({...selectedTodos})
                }
            }
        }

    }

    const isCompleted = (e, list) => {
        console.log(selectedTodos.todos.length)
        for (let index = 0; index < selectedTodos.todos.length; index++) {
            if (selectedTodos.todos[index].id === list.id) {
                dispatch(completeTodo({list, selectedTodos, index}))
                selectedTodos.todos.splice(index, 1, list)
                setSelectedTodos({...selectedTodos})
            }
        }

    }
    return (
        <>
            <NavLink to="/" className="returnHomeButton">
                Вернуться к списку листов
            </NavLink>
            {
                showForm === true ?
                    (
                        <FormCreateTodosList>
                            <input type="text" className="formCreateTodosTitle" placeholder="Название списка задач" name="title" onChange={(e) => handleChange(e)} autoFocus={true}/>
                            <select name="priority" className="formCreateTodosSelectedPriority" onChange={(e) => handleChange(e)}>
                                <option value="">Выберите приоритет списка</option>
                                <option value={0}>Низший</option>
                                <option value={1}>Низкий</option>
                                <option value={2}>Ниже среднего</option>
                                <option value={3}>Средний</option>
                                <option value={4}>Выше среднего</option>
                                <option value={5}>Высокий</option>
                                <option value={6}>Наивысший</option>
                            </select>
                            <button className="formCreateTodosButtonSubmit" onClick={(e) => createNewTodo(e, newTodo)}>Создать задачу</button>
                        </FormCreateTodosList>
                    )
                    :
                    (
                        <>
                            <ButtonShowFormCreateTodosLists
                                onClick={showFormCreateTodos}
                            >
                                Создать новую задачу
                            </ButtonShowFormCreateTodosLists>
                            <select name="appliedFilter" className="todosFilterSelect" onChange={e => selectedFilterForTodos(e)}>
                              <option value="all">All</option>
                              <option value="uncompleted">Uncompleted</option>
                              <option value="completed">Completed</option>
                            </select>
                        </>
                    )
            }
            {
                todos.length !== 0 ?
                    todos.filter(todo => {
                        if (selectedFilter === 'all') {
                            return todos
                        } else if (selectedFilter === 'completed') {
                            return todo.completed === true
                        } else if (selectedFilter === 'uncompleted') {
                            return todo.completed === false
                        }
                    }).sort((a, b) => b.priority - a.priority).map((lists) => {
                        console.log(todos)
                        return (
                            lists.editable === true ? (
                                    <form className="dataTodosList" key={lists.id}>
                                        <label className="todosListTitle">
                                            <input className="todosListTitle" name="title" defaultValue={lists.title} onKeyDown={(e) => updatedTodo(e, lists)} autoFocus={true}/>
                                        </label>
                                        <div className="todoListDeleteAndEdit">
                                            <DeleteIcon className="deleteIconTodosLists" onClick={(e) => removeTodo(e, lists.id)}/>
                                        </div>
                                    </form>)
                                :
                                (
                                    <div className="dataTodosList" key={lists.id}>
                                        {lists.completed === true ?
                                            <label className="todosListTitle completed" onClick={e => isCompleted(e, lists)}>
                                                <input className="todosListTitle completed" name="title" defaultValue={lists.title} disabled={true} autoFocus={true}/>
                                            </label>
                                            :
                                            <label className="todosListTitle" onClick={e => isCompleted(e, lists)}>
                                                <input className="todosListTitle" name="title" defaultValue={lists.title} disabled={true} autoFocus={true}/>
                                            </label>
                                        }
                                        <div className="todoListDeleteAndEdit">
                                            <DeleteIcon className="deleteIconTodosLists" onClick={(e) => removeTodo(e, lists.id)}/>
                                            <EditIcon className="editIconTodosLists" onClick={(e) => editingTodo(e, lists.id)}/>
                                        </div>
                                    </div>
                                )

                        )
                    })
                    :
                    load === true ?
                        (
                            <div className="todosLists">
                                <div className="createNewTodoText">
                                    <p>Получение данных с сервера</p>
                                </div>
                                <hr/>
                            </div>
                        )
                        :
                        (
                            <div className="todosLists">
                                <div className="createNewTodoText">
                                    <p>Создайте новую задачу!</p>
                                </div>
                                <hr/>
                            </div>
                        )
            }
        </>
    );
}

export default Todo;