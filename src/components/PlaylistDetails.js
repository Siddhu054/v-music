import React, { useState, useEffect } from "react";
import "./PlaylistDetails.css";
import { BiArrowBack } from "react-icons/bi";

function PlaylistDetails({ playlist, onBack }) {
  const [songs, setSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPlaylistSongs();
  }, [playlist.spotifyId]);

  const fetchPlaylistSongs = async () => {
    try {
      const response = await fetch(
        `https://api.spotify.com/v1/playlists/${playlist.spotifyId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("spotify_token")}`,
          },
        }
      );
      const data = await response.json();
      setSongs(data.items);
    } catch (error) {
      console.error("Error fetching songs:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="playlist-details">
      <div className="playlist-header">
        <button className="back-button" onClick={onBack}>
          <BiArrowBack /> Back
        </button>
        <div className="playlist-info">
          <h2>{playlist.name}</h2>
          <span className="category-tag">{playlist.category}</span>
        </div>
      </div>

      <div className="songs-list">
        {isLoading ? (
          <div className="loading">Loading songs...</div>
        ) : (
          songs.map((item, index) => (
            <div key={item.track.id} className="song-item">
              <div className="song-number">{index + 1}</div>
              <img
                src={item.track.album.images[0]?.url}
                alt={item.track.name}
                className="song-image"
              />
              <div className="song-info">
                <div className="song-name">{item.track.name}</div>
                <div className="song-artist">
                  {item.track.artists.map((artist) => artist.name).join(", ")}
                </div>
              </div>
              <div className="song-duration">
                {formatDuration(item.track.duration_ms)}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function formatDuration(ms) {
  const minutes = Math.floor(ms / 60000);
  const seconds = ((ms % 60000) / 1000).toFixed(0);
  return `${minutes}:${seconds.padStart(2, "0")}`;
}

export default PlaylistDetails;
