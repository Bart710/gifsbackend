const express = require("express");
const router = express.Router();
const {
  login,
  createUser,
  updateUser,
  deleteUser,
  getAllUsers,
  changePassword,
} = require("../controllers/authController");
const {
  authMiddleware,
  adminMiddleware,
} = require("../middleware/authMiddleware");

router.post("/login", login);
router.post("/users", authMiddleware, adminMiddleware, createUser);
router.put("/users/:id", authMiddleware, adminMiddleware, updateUser);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.post(
  "/users/:id/change-password",
  authMiddleware,
  adminMiddleware,
  changePassword
);

module.exports = router;
