const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  type: {
    type: String,
    enum: ["LIKE", "SHARE", "CREATE", "FOLLOW", "LISTEN"],
    required: true,
  },
  playlist: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Playlist",
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Activity", activitySchema);
