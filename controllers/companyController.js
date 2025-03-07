const db = require("../models");
const Company = db.Company;

// ✅ Add Company
const addCompany = async (req, res) => {
  try {
    const { name, website, industry, size, location, contactInfo, notes } = req.body;
    const userId = req.user.id;

    if (!name) {
      return res.status(400).json({ message: "Company name is required" });
    }

    const company = await Company.create({ userId, name, website, industry, size, location, contactInfo, notes });
    res.status(201).json({ success: true, company });
  } catch (error) {
    console.error("❌ Error adding company:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get All Companies
const getCompanies = async (req, res) => {
  try {
    const userId = req.user.id;
    const companies = await Company.findAll({ where: { userId } });

    res.json({ success: true, companies });
  } catch (error) {
    console.error("❌ Error fetching companies:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Company By ID
const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const company = await Company.findOne({ where: { id, userId } });
    if (!company) return res.status(404).json({ message: "Company not found" });

    res.json({ success: true, company });
  } catch (error) {
    console.error("❌ Error fetching company:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Company
const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, website, industry, size, location, contactInfo, notes } = req.body;
    const userId = req.user.id;

    const company = await Company.findOne({ where: { id, userId } });
    if (!company) return res.status(404).json({ message: "Company not found" });

    company.name = name || company.name;
    company.website = website || company.website;
    company.industry = industry || company.industry;
    company.size = size || company.size;
    company.location = location || company.location;
    company.contactInfo = contactInfo || company.contactInfo;
    company.notes = notes || company.notes;

    await company.save();
    res.json({ success: true, company });
  } catch (error) {
    console.error("❌ Error updating company:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete Company
const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const company = await Company.findOne({ where: { id, userId } });
    if (!company) return res.status(404).json({ message: "Company not found" });

    await company.destroy();
    res.json({ success: true, message: "Company deleted" });
  } catch (error) {
    console.error("❌ Error deleting company:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addCompany, getCompanies, getCompanyById, updateCompany, deleteCompany };
