const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const db = {};

// ✅ Import model functions
const UserModel = require("./User");
const CompanyModel = require("./Company");
const JobApplicationModel = require("./JobApplication");
const JobListingModel = require("./JobListing");

// ✅ Initialize models correctly
db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = UserModel(sequelize, DataTypes);
db.Company = CompanyModel(sequelize, DataTypes);
db.JobApplication = JobApplicationModel(sequelize, DataTypes);
db.JobListing = JobListingModel(sequelize, DataTypes);

// ✅ Define Associations
db.User.hasMany(db.Company, { foreignKey: "userId" });
db.Company.belongsTo(db.User, { foreignKey: "userId" });

db.Company.hasMany(db.JobListing, { foreignKey: "companyId" });
db.JobListing.belongsTo(db.Company, { foreignKey: "companyId" });

db.User.hasMany(db.JobApplication, { foreignKey: "userId" });
db.JobApplication.belongsTo(db.User, { foreignKey: "userId" });

module.exports = db;
