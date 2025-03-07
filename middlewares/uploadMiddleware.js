const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("📂 Multer: Saving file to uploads folder...");
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    console.log("📂 Multer: Processing file →", file.originalname);
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage });

module.exports = upload;
