const express = require("express");
const { addReminder, getReminders, updateReminder, deleteReminder } = require("../controllers/reminderController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, addReminder);
router.get("/", authenticate, getReminders);
router.put("/:id", authenticate, updateReminder);
router.delete("/:id", authenticate, deleteReminder);

module.exports = router;
