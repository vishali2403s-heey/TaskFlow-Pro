const db = require("../config/db");

exports.getProjects = (req, res) => {
  db.query(
    `SELECT p.*, u.name AS owner_name
     FROM projects p
     LEFT JOIN users u ON p.created_by = u.id
     WHERE p.created_by = ?
     ORDER BY p.created_at DESC`,
    [req.user.id],
    (err, projects) => {
      if (err) return res.status(500).json({ message: "Failed to load projects", error: err.message });
      res.json(projects);
    }
  );
};

exports.createProject = (req, res) => {
  const { name, description, status, progress, deadline } = req.body;

  if (!name) return res.status(400).json({ message: "Project name is required" });

  db.query(
    "INSERT INTO projects (name, description, status, progress, deadline, created_by) VALUES (?, ?, ?, ?, ?, ?)",
    [name, description || "", status || "Pending", progress || 0, deadline || null, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to create project", error: err.message });

      db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
        [req.user.id, "Project created", `Project "${name}" has been created.`, "project_created"]
      );

      res.status(201).json({ message: "Project created successfully", projectId: result.insertId });
    }
  );
};

exports.updateProject = (req, res) => {
  const { id } = req.params;
  const { name, description, status, progress, deadline } = req.body;

  db.query(
    "UPDATE projects SET name = ?, description = ?, status = ?, progress = ?, deadline = ? WHERE id = ? AND created_by = ?",
    [name, description || "", status, progress, deadline || null, id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to update project", error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Project not found" });

      res.json({ message: "Project updated successfully" });
    }
  );
};

exports.deleteProject = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM projects WHERE id = ? AND created_by = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to delete project", error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Project not found" });

      db.query(
        "INSERT INTO notifications (user_id, title, message, type) VALUES (?, ?, ?, ?)",
        [req.user.id, "Project deleted", "A project was removed from your workspace.", "project_deleted"]
      );

      res.json({ message: "Project deleted successfully" });
    }
  );
};
