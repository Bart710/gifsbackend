const User = require("../models/user");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { password } = req.body;

    // Find all users (we should only have a few)
    const users = await User.find();

    // Check the password against all users
    for (let user of users) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        // Password matched, return the role
        return res.json({ role: user.role });
      }
    }

    // If we get here, no password matched
    return res.status(401).json({ message: "Invalid credentials" });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.seedUsers = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      await User.create([
        { username: "admin", password: "adminpass", role: "admin" },
        { username: "user", password: "userpass", role: "user" },
        { username: "spectator", password: "spectatorpass", role: "spectator" },
      ]);
      console.log("Default users seeded");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
