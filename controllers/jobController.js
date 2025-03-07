const db = require("../models");
const JobListing = db.JobListing;
const Company = db.Company;

// ✅ Add Job Listing
const addJob = async (req, res) => {
  try {
    const { companyId, title, description, jobLink, status } = req.body;
    const userId = req.user.userId;

    // Ensure the company exists
    const company = await Company.findOne({ where: { id: companyId } });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const job = await JobListing.create({ userId, companyId, title, description, jobLink, status });
    res.status(201).json({ success: true, job });
  } catch (error) {
    console.error("❌ Error adding job listing:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get All Job Listings
const getJobs = async (req, res) => {
  try {
    const userId = req.user.id;
    const jobs = await JobListing.findAll({ where: { userId } });

    res.json({ success: true, jobs });
  } catch (error) {
    console.error("❌ Error fetching jobs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Job Listing By ID
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await JobListing.findOne({ where: { id, userId } });
    if (!job) return res.status(404).json({ message: "Job listing not found" });

    res.json({ success: true, job });
  } catch (error) {
    console.error("❌ Error fetching job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Job Listing
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, jobLink, status } = req.body;
    const userId = req.user.id;

    const job = await JobListing.findOne({ where: { id, userId } });
    if (!job) return res.status(404).json({ message: "Job listing not found" });

    job.title = title || job.title;
    job.description = description || job.description;
    job.jobLink = jobLink || job.jobLink;
    job.status = status || job.status;

    await job.save();
    res.json({ success: true, job });
  } catch (error) {
    console.error("❌ Error updating job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete Job Listing
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const job = await JobListing.findOne({ where: { id, userId } });
    if (!job) return res.status(404).json({ message: "Job listing not found" });

    await job.destroy();
    res.json({ success: true, message: "Job listing deleted" });
  } catch (error) {
    console.error("❌ Error deleting job:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addJob, getJobs, getJobById, updateJob, deleteJob };
