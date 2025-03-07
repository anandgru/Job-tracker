const { DataTypes, Model } = require("sequelize");

module.exports = (sequelize) => {
  class Company extends Model {}

  Company.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      name: { type: DataTypes.STRING, allowNull: false },
      industry: { type: DataTypes.STRING },
      size: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "Company",
      tableName: "companies",
      timestamps: true,
    }
  );

  return Company;
};
