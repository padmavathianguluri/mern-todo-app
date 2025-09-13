import React, { useEffect, useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import TaskForm from "../components/TaskForm";
import TaskItem from "../components/TaskItem";

export default function Todos() {
  const [tasks, setTasks] = useState([]);
  const { user, logout } = useContext(AuthContext);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/api/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      if (err.response?.status === 401) logout();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = (t) => setTasks((prev) => [t, ...prev]);
  const updateTask = (t) =>
    setTasks((prev) => prev.map((p) => (p._id === t._id ? t : p)));
  const removeTask = (id) =>
    setTasks((prev) => prev.filter((p) => p._id !== id));

  return (
    <div style={{ padding: 20 }}>
      <h2>Todos — {user?.username}</h2>
      <button onClick={logout}>Logout</button>
      <TaskForm onAdded={addTask} />
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {tasks.map((task) => (
          <li key={task._id}>
            <TaskItem
              task={task}
              onUpdated={updateTask}
              onDeleted={removeTask}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
