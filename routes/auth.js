const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models");
const path = require("path");
require("dotenv").config();

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await db.User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await db.User.create({ name, email, password: hashedPassword });

    // Generate JWT token
    const token = jwt.sign({ userId: newUser.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token and user information as a response
    res.status(201).json({
      message: 'User created successfully!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  } catch (error) {
    console.error('Error in signup:', error);
    res.status(500).json({ message: 'Error during Registration.' });
  }
});

router.get("/register", async (req, res) =>
  res.sendFile(path.join(__dirname, "../view", "register.html"))
);
// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    
    // Check if the user exists
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      
      return res.status(404).json({ message: 'User does not exist.' });
    }
    
    // Verify the password
    const isPasswordMatched = await bcrypt.compare(password, user.password);
    if (!isPasswordMatched) {
      return res.status(401).json({ message: 'Invalid password.' });
    }
    console.log('Token Generation: ' + isPasswordMatched);
    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Token Generation: ' + isPasswordMatched);
    // Send the token and user information as a response
    res.status(200).json({
      message: 'Login successful!',
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Error during login.' });
  }
});

module.exports = router;
