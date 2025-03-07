//const sequelize = require("../config/database");

const { Model, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  class JobApplication extends Model {}

  JobApplication.init(
    {
      jobTitle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      companyName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM("applied", "interview", "offer", "rejected"),
        allowNull: false,
      },
      applicationDate: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize, // ✅ Pass the Sequelize instance
      modelName: "JobApplication", // ✅ Define model name
      tableName: "job_applications", // ✅ Optional: Define table name explicitly
      timestamps: true, // ✅ Enable timestamps
    }
  );

  return JobApplication;
};

