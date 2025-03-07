const express = require("express");
const { addCompany, getCompanies, getCompanyById, updateCompany, deleteCompany } = require("../controllers/companyController");
const authenticate = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/", authenticate, addCompany);
router.get("/", authenticate, getCompanies);
router.get("/:id", authenticate, getCompanyById);
router.put("/:id", authenticate, updateCompany);
router.delete("/:id", authenticate, deleteCompany);

module.exports = router;
