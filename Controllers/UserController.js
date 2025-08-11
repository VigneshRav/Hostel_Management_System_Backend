import User from "../Models/User.js";

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.json(user);
};

export const updateProfile = async (req, res) => {
  const updates = req.body;
  if (updates.password) delete updates.password; // Password update separate
  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
  }).select("-password");
  res.json(user);
};

// Admin-only: List all users
export const listUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
};

// Admin-only: update any user by ID
export const updateUserById = async (req, res) => {
  const updates = req.body;
  if (updates.password) delete updates.password;
  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
  }).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

