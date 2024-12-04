import { AUDIO_CONFIG } from "../config/audio";

class SpotifyAuthService {
  login() {
    const { clientId, redirectUri, scopes } = AUDIO_CONFIG.spotify;

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: scopes.join(" "),
      response_type: "token",
      show_dialog: true,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  getTokenFromUrl() {
    const hash = window.location.hash
      .substring(1)
      .split("&")
      .reduce((initial, item) => {
        let parts = item.split("=");
        initial[parts[0]] = decodeURIComponent(parts[1]);
        return initial;
      }, {});

    window.location.hash = ""; // Clear the hash
    return hash.access_token;
  }

  setToken(token) {
    localStorage.setItem("spotify_token", token);
  }

  getToken() {
    return localStorage.getItem("spotify_token");
  }

  logout() {
    localStorage.removeItem("spotify_token");
    localStorage.removeItem("spotify_device_id");
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export default new SpotifyAuthService();
