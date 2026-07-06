const router = require("express").Router();
const analyticsController = require("../controllers/analyticsController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, analyticsController.getAnalytics);

module.exports = router;
