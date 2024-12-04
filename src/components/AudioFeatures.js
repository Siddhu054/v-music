import React, { useEffect, useState } from "react";
import SpotifyService from "../services/spotifyService";
import "./AudioFeatures.css";

function AudioFeatures({ trackId }) {
  const [features, setFeatures] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (trackId) {
      fetchAudioFeatures();
    }
  }, [trackId]);

  const fetchAudioFeatures = async () => {
    try {
      const data = await SpotifyService.getAudioFeatures(trackId);
      setFeatures(data);
    } catch (error) {
      console.error("Error fetching audio features:", error);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (!features) return null;

  return (
    <div className="audio-features">
      <h3>Audio Features</h3>
      <div className="features-grid">
        <div className="feature">
          <label>Danceability</label>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${features.danceability * 100}%` }}
            />
          </div>
        </div>
        <div className="feature">
          <label>Energy</label>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${features.energy * 100}%` }}
            />
          </div>
        </div>
        <div className="feature">
          <label>Valence</label>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${features.valence * 100}%` }}
            />
          </div>
        </div>
        {/* Add more features as needed */}
      </div>
    </div>
  );
}

export default AudioFeatures;
