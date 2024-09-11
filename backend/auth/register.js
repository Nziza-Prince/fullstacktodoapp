const { Router } = require("express");
const router = Router();
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  const { userName, email, password } = req.body;

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }

    // Encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      userName: userName,
      email: email,
      password: hashedPassword,
    });

    // Save the user to the database
    const result = await newUser.save();

    res.status(201).send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error creating user");
  }
});

module.exports = router;
