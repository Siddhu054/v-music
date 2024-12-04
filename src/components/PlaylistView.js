import React from "react";

function PlaylistView({ playlistId }) {
  return (
    <iframe
      src={`https://open.spotify.com/embed/playlist/${playlistId}`}
      width="100%"
      height="380"
      frameBorder="0"
      allow="encrypted-media"
    />
  );
}

export default PlaylistView;
