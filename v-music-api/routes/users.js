const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const Activity = require("../models/Activity");

// Get user profile
router.get("/profile", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("favorites")
      .populate("following")
      .populate("followers");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.patch("/profile", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["username", "email", "profilePicture"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ message: "Invalid updates" });
  }

  try {
    const user = await User.findById(req.user.userId);
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add song to favorites
router.post("/favorites/:songId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    if (!user.favorites.includes(req.params.songId)) {
      user.favorites.push(req.params.songId);
      await user.save();
    }
    res.json(user.favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove song from favorites
router.delete("/favorites/:songId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.favorites = user.favorites.filter(
      (id) => id.toString() !== req.params.songId
    );
    await user.save();
    res.json(user.favorites);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add recently played song
router.post("/recently-played/:songId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    user.recentlyPlayed.unshift({
      song: req.params.songId,
      playedAt: new Date(),
    });
    user.recentlyPlayed = user.recentlyPlayed.slice(0, 50); // Keep only last 50 songs
    await user.save();
    res.json(user.recentlyPlayed);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Follow user
router.post("/follow/:userId", auth, async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow.followers.includes(req.user.id)) {
      await userToFollow.updateOne({ $push: { followers: req.user.id } });
      await currentUser.updateOne({ $push: { following: req.params.userId } });
    }

    res.json({ message: "Successfully followed user" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user activity
router.get("/activity", auth, async (req, res) => {
  try {
    const activities = await Activity.find({
      $or: [{ user: req.user.id }, { user: { $in: req.user.following } }],
    })
      .populate("user")
      .populate("playlist")
      .populate("targetUser")
      .sort("-createdAt")
      .limit(20);

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
