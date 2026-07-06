const db = require("../config/db");

exports.getMembers = (req, res) => {
  db.query(
    "SELECT id, name, email, role FROM team_members WHERE user_id = ? ORDER BY id DESC",
    [req.user.id],
    (err, members) => {
      if (err) return res.status(500).json({ message: "Failed to load members", error: err.message });
      res.json(members);
    }
  );
};

exports.createMember = (req, res) => {
  const { name, email, role } = req.body;

  if (!name || !email) return res.status(400).json({ message: "Name and email are required" });

  db.query(
    "INSERT INTO team_members (user_id, name, email, role) VALUES (?, ?, ?, ?)",
    [req.user.id, name, email, role || "Member"],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to add member", error: err.message });
      res.status(201).json({ message: "Member added successfully", memberId: result.insertId });
    }
  );
};

exports.deleteMember = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM team_members WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to delete member", error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Member not found" });
      res.json({ message: "Member deleted successfully" });
    }
  );
};
