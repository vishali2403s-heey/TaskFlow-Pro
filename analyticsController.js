const db = require("../config/db");

exports.getAnalytics = (req, res) => {
  const userId = req.user.id;

  db.query(
    "SELECT COUNT(*) AS totalProjects FROM projects WHERE created_by = ?",
    [userId],
    (err, projectStats) => {
      if (err) return res.status(500).json({ message: "Failed to load analytics", error: err.message });

      db.query(
        "SELECT COUNT(*) AS totalTasks FROM tasks WHERE user_id = ?",
        [userId],
        (err2, taskStats) => {
          if (err2) return res.status(500).json({ message: "Failed to load analytics", error: err2.message });

          db.query(
            "SELECT COUNT(*) AS completedTasks FROM tasks WHERE user_id = ? AND status = 'Completed'",
            [userId],
            (err3, completedStats) => {
              if (err3) return res.status(500).json({ message: "Failed to load analytics", error: err3.message });

              res.json({
                projects: projectStats[0],
                tasks: taskStats[0],
                completed: completedStats[0],
              });
            }
          );
        }
      );
    }
  );
};
