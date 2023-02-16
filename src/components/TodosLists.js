import {useState, useEffect} from "react";
import axios from "axios";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import {useDispatch} from "react-redux";
import {NavLink} from "react-router-dom";
import {v4 as uuidv4} from "uuid";

import {ButtonShowFormCreateTodosLists, FormCreateTodosList} from "../shared";
import '../styles/TodosLists.css';
import {createTodosList, updateTodosList, deleteTodosList} from "../features/todosLists/todosLists";

let newTodosLists = {
    id: null,
    title: null,
    editing: false,
    priority: '0',
    todos: []
};

function TodosLists() {
  const dispatch = useDispatch();
  const [todosLists, setTodosLists] = useState([]);
  const [load, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const isCompletedAllTodo = (todos) => {
      return todos.completed === true ? true : false
  }

  useEffect(() => {
      axios.get('http://localhost:9999/todosLists').then(res => setTodosLists(res.data))
      setLoading(false);
  }, [setTodosLists])
  const handleChange = (e) => {
      newTodosLists[e.target.name] = e.target.value;
  }
  const showFormCreateTodosLists = () => {
      setShowForm(true)
  };
  const createNewTodosFromServer = (e, newTodosList) => {
    newTodosList.id = uuidv4()
    dispatch(createTodosList(newTodosList))
    const updatedTodosLists = [...todosLists]
    updatedTodosLists.push(newTodosList)
    setTodosLists(updatedTodosLists)
    setShowForm(false)
    newTodosLists = {
      id: null,
      title: null,
      editable: false,
      priority: '0',
      todos: []
    };
  };
  const editingTodosList = (e, id, index) => {
    const updatedTodosLists = [...todosLists];
    updatedTodosLists[index].editable = true;
    setTodosLists(updatedTodosLists)
  }
  const deleteTodosListsFromServer = async (e, id, index) => {
    await dispatch(deleteTodosList({id}))
    const updatedTodosLists = [...todosLists];
    updatedTodosLists.splice(index, 1)
    setTodosLists(updatedTodosLists)
  };

  const updatedTodosListsTitle = async (e, list, index) => {
    if (e.key === 'Enter') {
      list.title = e.target.value;
      list.editable = false;
      await dispatch(updateTodosList(list))
      const updatedTodosLists = [...todosLists];
      updatedTodosLists.splice(index, 1, list)
      updatedTodosLists[index].editable = false;
      setTodosLists(updatedTodosLists)
    } else if (e.key === 'Escape') {
      const updatedTodosLists = [...todosLists];
      updatedTodosLists[index].editable = false;
      setTodosLists(updatedTodosLists)
    }
  }

  return (
    <>
        {
            showForm === true ?
                (
                    <FormCreateTodosList>
                        <input type="text" className="formCreateTodosListsTitle" placeholder="Название списка задач" name="title" onChange={(e) => handleChange(e)} autoFocus={true}/>
                        <select name="priority" className="formCreateTodosListsSelectedPriority" onChange={(e) => handleChange(e)}>
                            <option value="">Выберите приоритет списка</option>
                            <option value={0}>Низший</option>
                            <option value={1}>Низкий</option>
                            <option value={2}>Ниже среднего</option>
                            <option value={3}>Средний</option>
                            <option value={4}>Выше среднего</option>
                            <option value={5}>Высокий</option>
                            <option value={6}>Наивысший</option>
                          </select>
                      <button className="formCreateTodosListsButtonSubmit" onClick={(e) => createNewTodosFromServer(e, newTodosLists)}>Создать список</button>
                    </FormCreateTodosList>
                )
                :
                (
                    <ButtonShowFormCreateTodosLists
                      onClick={showFormCreateTodosLists}
                    >
                     Создать новый список задач
                   </ButtonShowFormCreateTodosLists>
                )
        }
            {
                todosLists.length !== 0 ?
                    todosLists.sort((a, b) =>  b.priority - a.priority).map((lists, index) => {
                      return (
                            lists.editable === true ? (
                            <form className="dataTodosList" key={lists.id}>
                              <label className="todosListTitle" >
                                <input className="todosListTitle" name="title" defaultValue={lists.title} onKeyDown={(e) => updatedTodosListsTitle(e, lists, index)} autoFocus={true}/>
                              </label>
                              <div className="todoListDeleteAndEdit">
                                    <DeleteIcon className="deleteIconTodosLists" onClick={(e) => deleteTodosListsFromServer(e, lists.id, index)}/>
                                </div>
                            </form>)
                                :
                                ( lists.todos.every(isCompletedAllTodo) && lists.todos.length !== 0
                                   ?
                                      (
                                          <div className="dataTodosList" key={lists.id}>
                                            <NavLink to={lists.id} className="navLinkTodosLists completed">
                                              <label className="todosListTitle">
                                                <input className="todosListTitle" name="title" defaultValue={lists.title} disabled={true} autoFocus={true}/>
                                              </label>
                                            </NavLink>
                                            <div className="todoListDeleteAndEdit">
                                              <DeleteIcon className="deleteIconTodosLists" onClick={(e) => deleteTodosListsFromServer(e, lists.id, index)}/>
                                              <EditIcon className="editIconTodosLists" onClick={(e) => editingTodosList(e, lists.id, index)}/>
                                            </div>
                                          </div>
                                      )
                                      :
                                      (
                                          <div className="dataTodosList" key={lists.id}>
                                            <NavLink to={lists.id} className="navLinkTodosLists">
                                              <label className="todosListTitle">
                                                <input className="todosListTitle" name="title" defaultValue={lists.title} disabled={true} autoFocus={true}/>
                                              </label>
                                            </NavLink>
                                            <div className="todoListDeleteAndEdit">
                                              <DeleteIcon className="deleteIconTodosLists" onClick={(e) => deleteTodosListsFromServer(e, lists.id, index)}/>
                                              <EditIcon className="editIconTodosLists" onClick={(e) => editingTodosList(e, lists.id, index)}/>
                                            </div>
                                          </div>
                                      )
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
                                <p>Создайте новый список!</p>
                            </div>
                            <hr/>
                        </div>
                    )
            }
    </>
  );
}

export default TodosLists;