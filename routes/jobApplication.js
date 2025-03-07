const express = require("express");
const { Op } = require("sequelize");
const JobApplication = require("../models/JobApplication");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

// Create Job Application
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { companyName, jobTitle, applicationDate, status, notes } = req.body;
    const job = await JobApplication.create({ 
      userId: req.user.userId, 
      companyName, jobTitle, applicationDate, status, notes 
    });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get All Job Applications
router.get("/", authMiddleware, async (req, res) => {
  try {
    const jobs = await JobApplication.findAll({ where: { userId: req.user.userId } });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get Single Job Application
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobApplication.findOne({ where: { id: req.params.id, userId: req.user.userId } });
    if (!job) return res.status(404).json({ message: "Job Application not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update Job Application
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { companyName, jobTitle, applicationDate, status, notes } = req.body;
    const job = await JobApplication.findOne({ where: { id: req.params.id, userId: req.user.userId } });
    if (!job) return res.status(404).json({ message: "Job Application not found" });

    await job.update({ companyName, jobTitle, applicationDate, status, notes });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete Job Application
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const job = await JobApplication.findOne({ where: { id: req.params.id, userId: req.user.userId } });
    if (!job) return res.status(404).json({ message: "Job Application not found" });

    await job.destroy();
    res.json({ message: "Job Application deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
