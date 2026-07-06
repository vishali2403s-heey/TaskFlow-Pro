const router = require("express").Router();
const teamController = require("../controllers/teamController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, teamController.getMembers);
router.post("/", auth, teamController.createMember);
router.delete("/:id", auth, teamController.deleteMember);

module.exports = router;
