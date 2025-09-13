// backend/routes/tasks.js
const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const auth = require("../middleware/authMiddleware");

// All routes below require auth
router.use(auth);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ msg: "Content required" });

    const task = await new Task({ content, user: req.user.id }).save();
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort({
      createdAt: -1,
    });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// PUT /api/tasks/:id
router.put("/:id", async (req, res) => {
  try {
    const { content, completed } = req.body;
    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { content, completed },
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: "Task not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const removed = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!removed) return res.status(404).json({ msg: "Task not found" });
    res.json({ msg: "Task removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
