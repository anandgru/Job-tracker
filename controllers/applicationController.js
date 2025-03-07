const db = require("../models");
const { Op } = require("sequelize");

// ✅ Upload Resume Controller
const addResume = async (req, res) => {
  console.log("🔍 Received request:", req.params);
  console.log("📂 Uploaded file:", req.file);

  if (!req.file) {
    console.error("❌ No file received by multer!");
    return res.status(400).json({ message: "No file uploaded" });
  }

  const { applicationId } = req.params;
  const filePath = req.file.path;

  // ✅ Find Job Application
  const jobApplication = await db.JobApplication.findByPk(applicationId);
  if (!jobApplication) {
    return res.status(404).json({ message: "Job Application not found" });
  }

  // ✅ Save File Path in Database
  jobApplication.resume = filePath;
  await jobApplication.save();

  console.log("✅ File uploaded successfully:", filePath);
  res.json({ message: "File uploaded successfully", filePath });
};

const searchApplications = async (req, res) => {
    try {
      console.log("🔍 User ID from Token:", req.user); // Debugging
      const userId = req.user.userId; // ✅ Use userId from token

      if (!userId) {
        console.error("❌ Missing userId in request!");
        return res.status(401).json({ success: false, message: "Unauthorized" });
      }

      const { keyword, status, startDate, endDate } = req.query;
      const whereClause = { userId };

      if (keyword) {
        whereClause[Op.or] = [
          { jobTitle: { [Op.like]: `%${keyword}%` } },
          { companyName: { [Op.like]: `%${keyword}%` } }
        ];
      }

      if (status) whereClause.status = status;
      if (startDate && endDate) {
        whereClause.applicationDate = { [Op.between]: [new Date(startDate), new Date(endDate)] };
      }

      const applications = await db.JobApplication.findAll({ where: whereClause });

      res.json({ success: true, applications });
    } catch (error) {
      console.error("❌ Error fetching job applications:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
};

// ✅ Add Job Application Controller
const addApplication = async (req, res) => {
  try {
    const userId = req.user.userId; // Extract userId from the token
    const { jobTitle, companyName, status, applicationDate } = req.body;

    if (!jobTitle || !companyName || !status || !applicationDate) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ✅ Create new job application in database
    const application = await db.JobApplication.create({
      jobTitle,
      companyName,
      status,
      applicationDate,
      userId, // Assign to logged-in user
    });

    res.status(201).json({
      success: true,
      message: "Job application added successfully",
      application,
    });
  } catch (error) {
    console.error("❌ Error adding job application:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addResume, searchApplications, addApplication };
