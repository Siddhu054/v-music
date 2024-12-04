export const authEndpoint = "https://accounts.spotify.com/authorize";
export const clientId = "4f50848a8f724e05a6c9f1cf3da917eb";
export const redirectUri = "http://localhost:3000/callback";
export const scopes = [
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "playlist-read-private",
  "playlist-read-collaborative",
  "user-read-recently-played",
  "user-top-read",
];

export const getTokenFromUrl = () => {
  return window.location.hash
    .substring(1)
    .split("&")
    .reduce((initial, item) => {
      let parts = item.split("=");
      initial[parts[0]] = decodeURIComponent(parts[1]);
      return initial;
    }, {});
};

export const getAuthUrl = () => {
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: scopes.join(" "),
    response_type: "token",
    show_dialog: true,
  });

  return `${authEndpoint}?${params.toString()}`;
};

export const SPOTIFY_CONFIG = {
  authEndpoint,
  clientId,
  redirectUri,
  scopes,
};
