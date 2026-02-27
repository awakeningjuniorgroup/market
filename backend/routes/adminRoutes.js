const express = require("express");
const User = require("../models/user");
const { protect, isAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

// @route GET /api/admin/users
// @desc Get all users (admin only)
// @access Private/Admin
router.get("/", protect, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}).select("-password"); // ne pas renvoyer le hash
    res.json(users);
  } catch (error) {
    console.error("Erreur GET /api/admin/users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route POST /api/admin/users
// @desc Add a new user (admin only)
// @access Private/Admin
router.post("/", protect, isAdmin, async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    user = new User({
      name,
      email,
      password, // sera hashé automatiquement par le modèle User
      role: role || "customer",
    });

    await user.save();
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Erreur POST /api/admin/users:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route PUT /api/admin/users/:id
// @desc Update user info (admin only)
// @access Private/Admin
router.put("/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.role = req.body.role || user.role;

      const updatedUser = await user.save();
      res.json({ message: "User updated successfully", user: updatedUser });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Erreur PUT /api/admin/users/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

// @route DELETE /api/admin/users/:id
// @desc Delete a user (admin only)
// @access Private/Admin
router.delete("/:id", protect, isAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.remove();
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Erreur DELETE /api/admin/users/:id:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

module.exports = router;
