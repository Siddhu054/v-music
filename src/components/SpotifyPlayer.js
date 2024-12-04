import React, { useEffect, useState } from "react";

function SpotifyPlayer() {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem("spotify_token");
      const player = new Spotify.Player({
        name: "V Music Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
      });

      // Connect to the player
      player.connect();
      setPlayer(player);
    };

    return () => {
      if (player) {
        player.disconnect();
      }
    };
  }, []);

  return null;
}

export default SpotifyPlayer;
