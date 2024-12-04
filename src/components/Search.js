import React, { useState } from "react";
import SpotifyService from "../services/spotifyService";
import "./Search.css";

function Search({ onTrackSelect }) {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    const searchQuery = e.target.value;
    setQuery(searchQuery);

    if (searchQuery.trim()) {
      setLoading(true);
      try {
        const results = await SpotifyService.search(searchQuery, ["track"]);
        setSearchResults(results.tracks.items);
      } catch (error) {
        console.error("Search error:", error);
      }
      setLoading(false);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="search-section">
      <input
        type="text"
        placeholder="Search for songs..."
        value={query}
        onChange={handleSearch}
        className="search-input"
      />
      {loading && <div className="loading">Searching...</div>}
      <div className="search-results">
        {searchResults.map((track) => (
          <div
            key={track.id}
            className="track-item"
            onClick={() => onTrackSelect(track)}
          >
            <img
              src={track.album.images[0]?.url}
              alt={track.name}
              className="track-image"
            />
            <div className="track-info">
              <div className="track-name">{track.name}</div>
              <div className="track-artist">
                {track.artists.map((artist) => artist.name).join(", ")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
