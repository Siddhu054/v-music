import React, { useState } from "react";
import "./SpotifyEmbed.css";

function SpotifyEmbed({ playlistId }) {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="spotify-embed-container">
      {isLoading && <div className="loading-spinner">Loading...</div>}
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator&theme=0`}
        width="100%"
        height="380"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: "12px" }}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
}

export default SpotifyEmbed;
