const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Token banane ka helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
};

// Response mein password kabhi nahi bhejte
const userResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
});

const PHONE_REGEX = /^[0-9+\-\s]{7,15}$/;

// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // role yahan nahi lete, hamesha default "citizen" rahega
    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      token: generateToken(user._id),
      user: userResponse(user),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // password select:false hai, isliye .select("+password") zaroori hai
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      token: generateToken(user._id),
      user: userResponse(user),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.status(200).json({ user: userResponse(req.user) });
};

// @route   PATCH /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const updates = {};

    // Whitelist: sirf name aur phone. role/email/password yahan se nahi badalte
    if (name !== undefined) {
      if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 50) {
        return res
          .status(400)
          .json({ message: "Name must be between 2 and 50 characters" });
      }
      updates.name = name.trim();
    }

    if (phone !== undefined) {
      if (typeof phone !== "string" || (phone !== "" && !PHONE_REGEX.test(phone))) {
        return res.status(400).json({ message: "Invalid phone number" });
      }
      updates.phone = phone.trim();
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ user: userResponse(user) });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @route   PATCH /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
      return res
        .status(400)
        .json({ message: "currentPassword and newPassword are required" });
    }
    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.matchPassword(currentPassword))) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }
    if (await user.matchPassword(newPassword)) {
      return res
        .status(400)
        .json({ message: "New password must be different from current one" });
    }

    user.password = newPassword;
    await user.save(); // pre("save") hook bcrypt se hash kar deta hai

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
  changePassword,
};