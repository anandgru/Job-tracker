const express = require("express");
const sequelize = require("./config/database");
const authRoutes = require("./routes/auth");
const jobApplicationRoutes = require("./routes/applicationRoutes");
const reminderRoutes = require("./routes/reminderRoutes");
const companyRoutes = require("./routes/companyRoutes");
const jobRoutes = require("./routes/jobRoutes");
const path = require("path");
const bodyParser = require('body-parser');

require("./jobs/reminderJob");

const app = express();

app.use(express.json()); 
app.use(express.static(path.join(__dirname, "public")));

app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));


app.use("/companies", companyRoutes);



app.use("/jobs", jobRoutes);


app.use(express.json());

app.use("/user", authRoutes);


app.use("/reminders", reminderRoutes);

app.use("/applications", require("./routes/applicationRoutes"));

app.use("/applications", jobApplicationRoutes);

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'dashboard.html')); // Adjust the path to your dashboard.html
});
app.get('/profile', (req, res) => {
  res.sendFile(path.join(__dirname, 'view', 'profile.html')); // Adjust the path to your profile.html
});

sequelize.sync().then(() => {
  console.log("Database connected!");
  app.listen(3000, () => console.log("Server running on port 3000"));
});
