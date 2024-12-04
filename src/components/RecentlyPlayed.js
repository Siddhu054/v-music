import React, { useEffect, useState } from "react";
import { useAudio } from "../context/AudioContext";
import SpotifyService from "../services/spotifyService";
import "./RecentlyPlayed.css";

function RecentlyPlayed() {
  const [recentTracks, setRecentTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { playTrack } = useAudio();

  useEffect(() => {
    fetchRecentTracks();
  }, []);

  const fetchRecentTracks = async () => {
    try {
      const data = await SpotifyService.getRecentlyPlayed();
      setRecentTracks(data.items);
    } catch (error) {
      console.error("Error fetching recent tracks:", error);
    }
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="recently-played">
      <h2>Recently Played</h2>
      <div className="recent-tracks">
        {recentTracks.map((item) => (
          <div
            key={item.track.id}
            className="track-item"
            onClick={() => playTrack(item.track)}
          >
            <img
              src={item.track.album.images[0]?.url}
              alt={item.track.name}
              className="track-image"
            />
            <div className="track-info">
              <h3>{item.track.name}</h3>
              <p>{item.track.artists[0].name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentlyPlayed;
