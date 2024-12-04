export const AUDIO_CONFIG = {
  spotify: {
    clientId: process.env.REACT_APP_SPOTIFY_CLIENT_ID,
    redirectUri: process.env.REACT_APP_REDIRECT_URI,
    scopes: [
      "streaming",
      "user-read-email",
      "user-read-private",
      "user-library-read",
      "user-library-modify",
      "user-read-playback-state",
      "user-modify-playback-state",
      "playlist-read-private",
      "playlist-read-collaborative",
    ],
  },
  youtube: {
    apiKey: process.env.REACT_APP_YOUTUBE_API_KEY,
  },
};
