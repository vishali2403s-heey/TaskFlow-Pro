const db = require("../config/db");

exports.getTasks = (req, res) => {
  const { projectId } = req.query;
  const query = projectId
    ? `SELECT t.*, p.name AS project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.user_id = ? AND t.project_id = ? ORDER BY t.created_at DESC`
    : `SELECT t.*, p.name AS project_name FROM tasks t LEFT JOIN projects p ON t.project_id = p.id WHERE t.user_id = ? ORDER BY t.created_at DESC`;

  db.query(query, projectId ? [req.user.id, projectId] : [req.user.id], (err, tasks) => {
    if (err) return res.status(500).json({ message: "Failed to load tasks", error: err.message });
    res.json(tasks);
  });
};

exports.createTask = (req, res) => {
  const { title, description, project_id, priority, due_date, progress } = req.body;

  if (!title || !project_id) return res.status(400).json({ message: "Title and project are required" });

  db.query(
    "INSERT INTO tasks (title, description, project_id, user_id, priority, due_date, progress, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [title, description || "", project_id, req.user.id, priority || "Medium", due_date || null, progress || 0, "Pending"],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to create task", error: err.message });
      db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
        [req.user.id, "Task created", `Task "${title}" was added.`, "task_added"]
      );
      res.status(201).json({ message: "Task created successfully", taskId: result.insertId });
    }
  );
};

exports.updateTask = (req, res) => {
  const { id } = req.params;
  const { title, description, priority, due_date, progress, status } = req.body;

  db.query(
    "UPDATE tasks SET title = ?, description = ?, priority = ?, due_date = ?, progress = ?, status = ? WHERE id = ? AND user_id = ?",
    [title, description || "", priority, due_date || null, progress, status, id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to update task", error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Task not found" });
      res.json({ message: "Task updated successfully" });
    }
  );
};

exports.deleteTask = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to delete task", error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Task not found" });
      res.json({ message: "Task deleted successfully" });
    }
  );
};
