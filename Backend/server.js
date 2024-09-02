require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { seedUsers } = require("./controllers/authController");
const authRoutes = require("./routes/authRoutes");
const gifRoutes = require("./routes/gifRoutes");

const app = express();
const port = process.env.PORT || 3001;

// Connect to database
connectDB().then(() => {
  seedUsers();
});

app.use(cors());
app.use(express.json());

// Use the routes
app.use("/api", authRoutes);
app.use("/api", gifRoutes);

// For debugging: log all routes
app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${port} is busy, please try a different port.`);
    process.exit(1);
  } else {
    console.error("Error starting server:", err);
    process.exit(1);
  }
});
