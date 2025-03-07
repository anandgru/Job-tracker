const db = require("../models");
const Reminder = db.Reminder;

// ✅ Add Reminder
const addReminder = async (req, res) => {
  try {
    const { applicationId, reminderDate, message } = req.body;
    const userId = req.user.id;

    if (!applicationId || !reminderDate || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const reminder = await Reminder.create({ userId, applicationId, reminderDate, message });

    res.status(201).json({ success: true, reminder });
  } catch (error) {
    console.error("❌ Error adding reminder:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Get Reminders
const getReminders = async (req, res) => {
  try {
    const userId = req.user.id;
    const reminders = await Reminder.findAll({ where: { userId } });

    res.json({ success: true, reminders });
  } catch (error) {
    console.error("❌ Error fetching reminders:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Update Reminder
const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { reminderDate, message, status } = req.body;
    const userId = req.user.id;

    const reminder = await Reminder.findOne({ where: { id, userId } });
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    reminder.reminderDate = reminderDate || reminder.reminderDate;
    reminder.message = message || reminder.message;
    reminder.status = status || reminder.status;

    await reminder.save();
    res.json({ success: true, reminder });
  } catch (error) {
    console.error("❌ Error updating reminder:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Delete Reminder
const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reminder = await Reminder.findOne({ where: { id, userId } });
    if (!reminder) return res.status(404).json({ message: "Reminder not found" });

    await reminder.destroy();
    res.json({ success: true, message: "Reminder deleted" });
  } catch (error) {
    console.error("❌ Error deleting reminder:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { addReminder, getReminders, updateReminder, deleteReminder };
