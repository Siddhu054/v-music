import React from "react";
import spotifyAuthService from "../services/spotifyAuthService";
import "./Login.css";

function Login() {
  const handleLogin = () => {
    spotifyAuthService.login();
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <h1>Welcome to V Music</h1>
        <button onClick={handleLogin} className="spotify-login-btn">
          Login with Spotify
        </button>
      </div>
    </div>
  );
}

export default Login;
