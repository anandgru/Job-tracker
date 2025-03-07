const express = require("express");
const { addJob, getJobs, getJobById, updateJob, deleteJob } = require("../controllers/jobController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, addJob);
router.get("/", authenticate, getJobs);
router.get("/:id", authenticate, getJobById);
router.put("/:id", authenticate, updateJob);
router.delete("/:id", authenticate, deleteJob);

module.exports = router;
