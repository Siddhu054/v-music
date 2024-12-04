const express = require("express");
const router = express.Router();
const Song = require("../models/Song");

// Get all songs with pagination
router.get("/", async (req, res) => {
  try {
    console.log("Fetching songs...");
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const songs = await Song.find()
      .skip(skip)
      .limit(limit)
      .sort({ popularity: -1 });

    console.log(`Found ${songs.length} songs`);

    const total = await Song.countDocuments();
    console.log(`Total songs in database: ${total}`);

    res.json({
      songs,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalSongs: total,
    });
  } catch (error) {
    console.error("Error fetching songs:", error);
    res.status(500).json({ message: error.message });
  }
});

// Search songs
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    const songs = await Song.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { artist: { $regex: q, $options: "i" } },
        { album: { $regex: q, $options: "i" } },
      ],
    }).limit(20);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get songs by genre
router.get("/genre/:genre", async (req, res) => {
  try {
    const songs = await Song.find({ genre: req.params.genre })
      .sort({ popularity: -1 })
      .limit(20);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add this route to check song count
router.get("/count", async (req, res) => {
  try {
    const count = await Song.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get top songs
router.get("/top", async (req, res) => {
  try {
    const songs = await Song.find().sort({ popularity: -1 }).limit(10);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get songs by artist
router.get("/artist/:artist", async (req, res) => {
  try {
    const songs = await Song.find({
      artist: { $regex: req.params.artist, $options: "i" },
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get songs by album
router.get("/album/:album", async (req, res) => {
  try {
    const songs = await Song.find({
      album: { $regex: req.params.album, $options: "i" },
    });
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recently added songs
router.get("/recent", async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 }).limit(20);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get random songs
router.get("/random", async (req, res) => {
  try {
    const count = await Song.countDocuments();
    const random = Math.floor(Math.random() * count);
    const songs = await Song.find().skip(random).limit(10);
    res.json(songs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
