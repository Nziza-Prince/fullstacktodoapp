const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const register = require("./auth/register.js");
const login = require("./auth/login.js");
const todos = require("./apis.js"); // Import the todos routes

const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URI;

// CORS middleware configuration
app.use(cors());
app.use(express.json());

// Registering the routes
app.use("/register", register);
app.use("/login", login);
app.use("/users", todos); // Use the todos routes

// Connecting to MongoDB
mongoose
  .connect(mongoUrl)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Starting the server
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));

app.get("/", (req, res) => {
  res.send("Server is up and running");
});
