const router = require("express").Router();
const notificationController = require("../controllers/notificationController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, notificationController.getNotifications);
router.delete("/:id", auth, notificationController.deleteNotification);

module.exports = router;
