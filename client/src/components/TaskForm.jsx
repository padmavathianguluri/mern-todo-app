import React, { useState } from "react";
import API from "../services/api";

export default function TaskForm({ onAdded }) {
  const [text, setText] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      const res = await API.post("/api/tasks", { content: text });
      onAdded(res.data);
      setText("");
    } catch (err) {
      alert("Add failed");
    }
  };
  return (
    <form onSubmit={submit}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="New task"
      />
      <button type="submit">Add</button>
    </form>
  );
}
