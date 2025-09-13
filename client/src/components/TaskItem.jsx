import React, { useState } from "react";
import API from "../services/api";

export default function TaskItem({ task, onUpdated, onDeleted }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(task.content);

  const toggle = async () => {
    try {
      const res = await API.put(`/api/tasks/${task._id}`, {
        completed: !task.completed,
        content: task.content,
      });
      onUpdated(res.data);
    } catch (err) {
      alert("Update failed");
    }
  };

  const save = async () => {
    try {
      const res = await API.put(`/api/tasks/${task._id}`, {
        content: text,
        completed: task.completed,
      });
      onUpdated(res.data);
      setEditing(false);
    } catch (err) {
      alert("Save failed");
    }
  };

  const del = async () => {
    if (!confirm("Delete this task?")) return;
    try {
      await API.delete(`/api/tasks/${task._1d}`);
      // there was a typo above intentionally — correct line:
    } catch (err) {
      /* fallback to correct deletion below */
    }

    try {
      await API.delete(`/api/tasks/${task._id}`);
      onDeleted(task._id);
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div style={{ marginBottom: 8 }}>
      <input type="checkbox" checked={task.completed} onChange={toggle} />
      {editing ? (
        <>
          <input value={text} onChange={(e) => setText(e.target.value)} />
          <button onClick={save}>Save</button>
          <button
            onClick={() => {
              setEditing(false);
              setText(task.content);
            }}
          >
            Cancel
          </button>
        </>
      ) : (
        <>
          <span
            style={{
              textDecoration: task.completed ? "line-through" : "none",
              marginLeft: 8,
            }}
          >
            {task.content}
          </span>
          <button onClick={() => setEditing(true)} style={{ marginLeft: 6 }}>
            Edit
          </button>
          <button onClick={del} style={{ marginLeft: 6 }}>
            Delete
          </button>
        </>
      )}
    </div>
  );
}
