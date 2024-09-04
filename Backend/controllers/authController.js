const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log(`Login attempt for username: ${username}`);

    const user = await User.findOne({ username });
    if (!user) {
      console.log(`User not found: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(`User found: ${username}`);
    console.log(`Stored hashed password: ${user.password}`);

    const isMatch = await bcrypt.compare(password, user.password);
    console.log(`Password match result: ${isMatch}`);

    if (!isMatch) {
      console.log(`Password mismatch for user: ${username}`);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log(`Login successful for user: ${username}`);
    res.json({ token, role: user.role });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    console.log(`Creating user: ${username}, role: ${role}`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(`Hashed password for new user: ${hashedPassword}`);

    const newUser = new User({ username, password: hashedPassword, role });
    await newUser.save();

    console.log(`User created successfully: ${username}`);
    res.status(201).json({
      message: "User created successfully",
      user: { username, role },
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(400)
      .json({ message: "Error creating user", error: error.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const userId = req.params.id || req.user._id;

    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found for password change: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`Changing password for user: ${user.username}`);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    console.log(`New hashed password: ${hashedPassword}`);

    user.password = hashedPassword;
    await user.save();

    console.log(`Password changed successfully for user: ${user.username}`);
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res
      .status(500)
      .json({ message: "Error changing password", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, role } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { username, email, role },
      { new: true }
    ).select("-password");
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error updating user", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting user", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching users", error: error.message });
  }
};

exports.seedUsers = async () => {
  try {
    const users = await User.find();
    if (users.length === 0) {
      await User.create([
        {
          username: "admin",
          password: "adminpass",
          role: "admin",
          email: "admin@example.com",
        },
      ]);
      console.log("Default users seeded");
    }
  } catch (error) {
    console.error("Error seeding users:", error);
  }
};
