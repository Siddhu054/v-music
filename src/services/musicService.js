import axios from "axios";
import { API_BASE_URL } from "../config/api";

class MusicService {
  async getSongs(page = 1, limit = 20) {
    const response = await axios.get(
      `${API_BASE_URL}/songs?page=${page}&limit=${limit}`
    );
    return response.data;
  }

  async searchSongs(query) {
    const response = await axios.get(
      `${API_BASE_URL}/songs/search?q=${encodeURIComponent(query)}`
    );
    return response.data;
  }

  async getSongsByGenre(genre) {
    const response = await axios.get(`${API_BASE_URL}/songs/genre/${genre}`);
    return response.data;
  }
}

export default new MusicService();
