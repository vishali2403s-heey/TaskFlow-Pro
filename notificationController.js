const db = require("../config/db");

exports.getNotifications = (req, res) => {
  db.query(
    "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC",
    [req.user.id],
    (err, notifications) => {
      if (err) return res.status(500).json({ message: "Failed to load notifications", error: err.message });
      res.json(notifications);
    }
  );
};

exports.deleteNotification = (req, res) => {
  const { id } = req.params;

  db.query(
    "DELETE FROM notifications WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to delete notification", error: err.message });
      if (result.affectedRows === 0) return res.status(404).json({ message: "Notification not found" });
      res.json({ message: "Notification deleted successfully" });
    }
  );
};
