const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Reminder extends Model {}

Reminder.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    applicationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reminderDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    message: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "completed"),
      defaultValue: "pending",
    },
  },
  {
    sequelize,
    modelName: "Reminder",
    tableName: "reminders",
    timestamps: true,
  }
);

module.exports = Reminder;
