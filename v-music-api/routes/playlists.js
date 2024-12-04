const express = require("express");
const router = express.Router();
const Playlist = require("../models/Playlist");
const auth = require("../middleware/auth");

// Get all playlists
router.get("/", auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.userId })
      .populate("songs")
      .sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new playlist
router.post("/", auth, async (req, res) => {
  try {
    const playlist = new Playlist({
      ...req.body,
      user: req.user.userId,
    });
    await playlist.save();
    res.status(201).json(playlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Add song to playlist
router.post("/:playlistId/songs/:songId", auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.playlistId,
      user: req.user.userId,
    });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    if (!playlist.songs.includes(req.params.songId)) {
      playlist.songs.push(req.params.songId);
      await playlist.save();
    }
    res.json(playlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Remove song from playlist
router.delete("/:playlistId/songs/:songId", auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOne({
      _id: req.params.playlistId,
      user: req.user.userId,
    });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    playlist.songs = playlist.songs.filter(
      (id) => id.toString() !== req.params.songId
    );
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete playlist
router.delete("/:id", auth, async (req, res) => {
  try {
    const playlist = await Playlist.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });
    if (!playlist) {
      return res.status(404).json({ message: "Playlist not found" });
    }
    res.json({ message: "Playlist deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
