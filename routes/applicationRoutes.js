const express = require("express");
const upload = require("../middlewares/uploadMiddleware");  // ✅ Import multer
const { addResume, searchApplications, addApplication } = require("../controllers/applicationController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Upload Resume Route
router.post("/upload/:applicationId", authenticate, upload.single("file"), (req, res, next) => {
    console.log("🛠 Route Debug: Multer middleware executed.");
    console.log("📂 Incoming file:", req.file);
    next();
  }, addResume);
  router.get("/search", authenticate, searchApplications);
  router.post("/", authenticate, addApplication);

  

module.exports = router;
