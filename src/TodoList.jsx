import { useEffect, useState } from "react";
export default function TodoList() {
    const [todos, setTodos] = useState([]);
    const [newTodo, setNewTodo] = useState("");
    const [toggleSubmit, setToggleSubmit] = useState(true);
    const [editId, setEditId] = useState(null);
    // Base API URL
    const API_URL = "https://todo-backend-ochre-eight.vercel.app/api"; // Replace with your backend's URL

    // Fetch all todos from the backend
    const fetchTodos = async () => {
        try {
            const response = await fetch(`${API_URL}/todos`);
            const data = await response.json();
            setTodos(data);
        } catch (error) {
            console.error("Error fetching todos:", error);
        }
    };
    // Add or update a todo
    const addNewTask = async () => {
        const trimmedTodo = newTodo.trim();
        if (!trimmedTodo) return;

        try {
            if (editId) {
                // Update task
                const response = await fetch(`${API_URL}/todos/${editId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: trimmedTodo }),
                });
                if (response.ok) {
                    fetchTodos();
                    setEditId(null);
                    setToggleSubmit(true);
                }
            } else {
                // Add new task
                const response = await fetch(`${API_URL}/todos`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ task: trimmedTodo, isDone: false }),
                });
                if (response.ok) {
                    fetchTodos();
                }
            }
            setNewTodo("");
        } catch (error) {
            console.error("Error adding or updating todo:", error);
        }
    };

    // Delete a todo
    const deleteTodo = async (id) => {
        try {
            const response = await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
            if (response.ok) {
                setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
            }
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };
    // Mark a todo as done
    const markAsDone = async (id) => {
        try {
            const todo = todos.find((t) => t._id === id);
            const response = await fetch(`${API_URL}/todos/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...todo, isDone: true }),
            });
            if (response.ok) {
                fetchTodos();
            }
        } catch (error) {
            console.error("Error marking todo as done:", error);
        }
    };

    // Mark all todos as done
    const markAllDone = async () => {
        try {
            await Promise.all(
                todos.map((todo) =>
                    fetch(`${API_URL}/todos/${todo._id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ ...todo, isDone: true }),
                    })
                )
            );
            fetchTodos();
        } catch (error) {
            console.error("Error marking all todos as done:", error);
        }
    };
    // Edit a todo
    const editTodo = (id) => {
        const todoToEdit = todos.find((todo) => todo._id === id);
        setNewTodo(todoToEdit.task);
        setEditId(id);
        setToggleSubmit(false);
    };

    // Fetch todos on component mount
    useEffect(() => {
        fetchTodos();
    }, []);

    return (
        <div className="top">
            <h3>TODO LIST</h3>
            <div>
                <input
                    autoFocus
                    placeholder="Add a task"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    className="op"
                />
                <button className="btn" onClick={addNewTask}>
                    {toggleSubmit ? "+" : "Update"}
                </button>
            </div>
            <br />
            <div className="Inlist1">
                <h4>Todo List</h4>
                <ul className="change">
                    {todos.map((todo) => (
                        <div className="Withinlist" key={todo._id}>
                            <li style={{ margin: "10px" }}>
                                <span style={todo.isDone ? { textDecoration: "line-through" } : {}}>
                                    {todo.task}
                                </span>
                                &nbsp; &nbsp;
                                <i
                                    onClick={() => deleteTodo(todo._id)}
                                    className="fa-solid fa-trash DelChang"
                                ></i>
                                <i
                                    onClick={() => editTodo(todo._id)}
                                    className="fa-regular fa-pen-to-square Edit"
                                ></i>
                                <i
                                    onClick={() => markAsDone(todo._id)}
                                    className="fa-solid fa-check-double test"
                                ></i>
                            </li>
                        </div>
                    ))}
                </ul>
                <br />
                <button onClick={markAllDone}>Mark All As Done</button>
            </div>
        </div>
    );
}
