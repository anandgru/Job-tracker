const cron = require("node-cron");
const db = require("../models");
const sendEmail = require("../utils/emailService");

const Reminder = db.Reminder;
const User = db.User;

// ✅ Run this job every hour
cron.schedule("0 * * * *", async () => {
  console.log("🔔 Checking for due reminders...");

  const now = new Date();
  const reminders = await Reminder.findAll({ where: { reminderDate: { [db.Sequelize.Op.lte]: now }, status: "pending" } });

  for (let reminder of reminders) {
    const user = await User.findByPk(reminder.userId);
    if (user && user.email) {
      await sendEmail(user.email, "Job Application Reminder", `Reminder: ${reminder.message}`);
      reminder.status = "completed";
      await reminder.save();
    }
  }

  console.log(`✅ Processed ${reminders.length} reminders`);
});

module.exports = cron;
