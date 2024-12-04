import axios from "axios";

class SpotifyService {
  constructor() {
    this.api = axios.create({
      baseURL: "https://api.spotify.com/v1",
    });

    // Add interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("spotify_token");
          window.location.href = "/"; // Redirect to login
        }
        return Promise.reject(error);
      }
    );
  }

  setToken(token) {
    if (!token) {
      console.error("No token provided");
      return;
    }
    this.api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Search for tracks with error handling
  async searchTracks(query) {
    if (!this.api.defaults.headers.common["Authorization"]) {
      console.log("No authentication token");
      return [];
    }

    try {
      const response = await this.api.get(`/search`, {
        params: {
          q: query,
          type: "track",
          limit: 20,
        },
      });
      return response.data.tracks.items;
    } catch (error) {
      console.error("Search error:", error.response?.data || error.message);
      return [];
    }
  }

  // Get track details with error handling
  async getTrack(trackId) {
    if (!trackId) {
      console.error("No track ID provided");
      return null;
    }

    try {
      const response = await this.api.get(`/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      console.error("Get track error:", error.response?.data || error.message);
      return null;
    }
  }

  // Get user's playlists with error handling
  async getUserPlaylists() {
    try {
      const response = await this.api.get("/me/playlists");
      return response.data.items;
    } catch (error) {
      console.error(
        "Get playlists error:",
        error.response?.data || error.message
      );
      return [];
    }
  }

  // Get playlist tracks with error handling
  async getPlaylistTracks(playlistId) {
    if (!playlistId) {
      console.error("No playlist ID provided");
      return [];
    }

    try {
      const response = await this.api.get(`/playlists/${playlistId}/tracks`);
      return response.data.items;
    } catch (error) {
      console.error(
        "Get playlist tracks error:",
        error.response?.data || error.message
      );
      return [];
    }
  }

  // Check if token is valid
  async isTokenValid() {
    try {
      await this.api.get("/me");
      return true;
    } catch {
      return false;
    }
  }
}

export default new SpotifyService();
