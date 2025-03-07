const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class JobListing extends Model {}

  JobListing.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT },
      location: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "JobListing",
      tableName: "job_listings",
      timestamps: true,
    }
  );

  return JobListing;
};
