const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: {
    type: String,
    required: true,
  },
  album: String,
  duration: Number,
  imageUrl: String,
  spotifyId: String,
  spotifyUrl: String,
  previewUrl: String,
  localAudioUrl: String,
  youtubeId: String,
  sourceType: {
    type: String,
    enum: ["spotify", "local", "youtube"],
    required: true,
  },
});

module.exports = mongoose.model("Song", songSchema);
