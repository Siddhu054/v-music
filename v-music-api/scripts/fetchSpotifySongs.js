require("dotenv").config();
const axios = require("axios");
const Song = require("../models/Song");
const mongoose = require("mongoose");

// Spotify API credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

async function getSpotifyToken() {
  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(CLIENT_ID + ":" + CLIENT_SECRET).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
  return response.data.access_token;
}

async function fetchSpotifyPlaylists() {
  try {
    const token = await getSpotifyToken();
    console.log("Got Spotify token");

    // List of playlist IDs to fetch from
    const playlistIds = [
      "37i9dQZF1DXcBWIGoYBM5M", // Today's Top Hits
      "37i9dQZF1DX0XUsuxWHRQd", // RapCaviar
      "37i9dQZF1DX4JAvHpjipBk", // New Music Friday
      "37i9dQZF1DX10zKzsJ2jva", // Viva Latino
      "37i9dQZF1DX4sWSpwq3LiO", // Peaceful Piano
      "37i9dQZF1DX4dyzvuaRJ0n", // Electronic Mix
      "37i9dQZF1DXcF6B6QPhFDv", // Rock This
      "37i9dQZF1DX6ThddIjWuGT", // Bollywood Butter
      "37i9dQZF1DX7KNKjOK0o75", // Have a Great Day!
      "37i9dQZF1DWY7IeIP1cdjF", // Punjabi 101
    ];

    for (const playlistId of playlistIds) {
      console.log(`Fetching playlist: ${playlistId}`);

      try {
        const response = await axios.get(
          `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(`Found ${response.data.items.length} tracks in playlist`);

        for (const item of response.data.items) {
          if (!item.track) continue;

          const track = item.track;

          // Check if song already exists
          const existingSong = await Song.findOne({ spotifyId: track.id });
          if (existingSong) {
            console.log(`Song already exists: ${track.name}`);
            continue;
          }

          const song = new Song({
            title: track.name,
            artist: track.artists.map((artist) => artist.name).join(", "),
            album: track.album.name,
            duration: track.duration_ms,
            imageUrl: track.album.images[0]?.url,
            audioUrl: track.preview_url || "",
            genre: track.album.genres?.[0] || "Unknown",
            releaseDate: track.album.release_date,
            popularity: track.popularity,
            spotifyId: track.id,
            previewUrl: track.preview_url,
            externalUrl: track.external_urls.spotify,
          });

          await song.save();
          console.log(`Saved: ${song.title}`);
        }
      } catch (error) {
        console.error(`Error fetching playlist ${playlistId}:`, error.message);
      }
    }
  } catch (error) {
    console.error("Error in fetchSpotifyPlaylists:", error.message);
    throw error;
  }
}

// Connect to MongoDB and run the script
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    return fetchSpotifyPlaylists();
  })
  .then(() => {
    console.log("Finished fetching songs");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  });
