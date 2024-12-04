import axios from "axios";
import { API_BASE_URL } from "../config/api";

class AuthService {
  constructor() {
    this.token = localStorage.getItem("token");
    this.refreshToken = localStorage.getItem("refreshToken");
    this.tokenExpiry = localStorage.getItem("tokenExpiry");
    this.setupTokenRefresh();
  }

  setupTokenRefresh() {
    if (this.tokenExpiry) {
      const expiryTime = new Date(this.tokenExpiry).getTime();
      const now = new Date().getTime();
      const timeUntilRefresh = expiryTime - now - 60000; // Refresh 1 minute before expiry

      if (timeUntilRefresh > 0) {
        setTimeout(() => this.refreshToken(), timeUntilRefresh);
      }
    }
  }

  async login(credentials) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        credentials
      );
      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/register`,
        userData
      );
      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  async socialLogin(provider) {
    window.location.href = `${API_BASE_URL}/auth/${provider}`;
  }

  async requestPasswordReset(email) {
    return axios.post(`${API_BASE_URL}/auth/reset-password`, { email });
  }

  async resetPassword(token, newPassword) {
    return axios.post(`${API_BASE_URL}/auth/reset-password/${token}`, {
      password: newPassword,
    });
  }

  async refreshAccessToken() {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
        refreshToken: this.refreshToken,
      });
      this.setTokens(response.data);
      return response.data;
    } catch (error) {
      this.logout();
      throw error;
    }
  }

  setTokens(data) {
    this.token = data.token;
    this.refreshToken = data.refreshToken;
    this.tokenExpiry = data.tokenExpiry;

    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("tokenExpiry", data.tokenExpiry);

    axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
    this.setupTokenRefresh();
  }

  logout() {
    this.token = null;
    this.refreshToken = null;
    this.tokenExpiry = null;

    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("tokenExpiry");

    delete axios.defaults.headers.common["Authorization"];
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export default new AuthService();
