const express = require("express");
const router = express.Router();
const Song = require("../models/Song");

// Get all artists
router.get("/", async (req, res) => {
  try {
    const artists = await Song.distinct("artist");
    res.json(artists);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artist details
router.get("/:artist", async (req, res) => {
  try {
    const songs = await Song.find({
      artist: { $regex: req.params.artist, $options: "i" },
    });
    const albums = await Song.distinct("album", {
      artist: { $regex: req.params.artist, $options: "i" },
    });

    res.json({
      artist: req.params.artist,
      songCount: songs.length,
      albums: albums,
      songs: songs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get artist's top songs
router.get("/:artist/top", async (req, res) => {
  try {
    const songs = await Song.find({
      artist: { $regex: req.params.artist, $options: "i" },
    })
      .sort({ popularity: -1 })
      .limit(10);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
