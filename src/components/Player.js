import React, { useState, useEffect } from "react";
import SpotifyPlayer from "./SpotifyPlayer";
import {
  BiShuffle,
  BiRepeat,
  BiVolumeFull,
  BiVolumeMute,
  BiSkipPrevious,
  BiPause,
  BiPlay,
  BiSkipNext,
} from "react-icons/bi";
import "./Player.css";

function Player({ currentTrack }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isShuffle, setIsShuffle] = useState(false);
  const [repeatMode, setRepeatMode] = useState(0); // 0: off, 1: context, 2: track
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    // Update progress every second
    const interval = setInterval(async () => {
      const player = window.spotifyPlayer;
      if (player) {
        const state = await player.getCurrentState();
        if (state) {
          setProgress(state.position);
          setDuration(state.duration);
          setIsPlaying(!state.paused);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const togglePlay = async () => {
    const player = window.spotifyPlayer;
    if (!player) return;

    const state = await player.getCurrentState();
    if (!state) return;

    if (state.paused) {
      await player.resume();
    } else {
      await player.pause();
    }
    setIsPlaying(!state.paused);
  };

  const handleSeek = async (value) => {
    const player = window.spotifyPlayer;
    if (!player) return;
    await player.seek(parseInt(value));
    setProgress(value);
  };

  const handleVolume = async (value) => {
    const player = window.spotifyPlayer;
    if (!player) return;
    await player.setVolume(parseFloat(value));
    setVolume(value);
    setIsMuted(value === 0);
  };

  const toggleMute = async () => {
    const player = window.spotifyPlayer;
    if (!player) return;
    if (isMuted) {
      await player.setVolume(volume);
      setIsMuted(false);
    } else {
      await player.setVolume(0);
      setIsMuted(true);
    }
  };

  const toggleShuffle = async () => {
    const token = localStorage.getItem("spotify_token");
    await fetch(
      "https://api.spotify.com/v1/me/player/shuffle?state=" + !isShuffle,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setIsShuffle(!isShuffle);
  };

  const toggleRepeat = async () => {
    const token = localStorage.getItem("spotify_token");
    const modes = ["off", "context", "track"];
    const nextMode = (repeatMode + 1) % 3;

    await fetch(
      `https://api.spotify.com/v1/me/player/repeat?state=${modes[nextMode]}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setRepeatMode(nextMode);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="player">
      <SpotifyPlayer />

      <div className="player-left">
        {currentTrack && (
          <div className="player-info">
            <img src={currentTrack.image} alt={currentTrack.title} />
            <div>
              <h3>{currentTrack.title}</h3>
              <p>{currentTrack.artist}</p>
            </div>
          </div>
        )}
      </div>

      <div className="player-center">
        <div className="player-controls">
          <button
            className="control-button prev-button"
            onClick={() => window.spotifyPlayer?.previousTrack()}
            title="Previous"
          >
            <BiSkipPrevious className="control-icon" />
            <span className="button-label">Previous</span>
          </button>

          <button
            className="play-button"
            onClick={togglePlay}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <BiPause className="control-icon" style={{ fontSize: "32px" }} />
            ) : (
              <BiPlay
                className="control-icon"
                style={{ fontSize: "32px", marginLeft: "4px" }}
              />
            )}
          </button>

          <button
            className="control-button next-button"
            onClick={() => window.spotifyPlayer?.nextTrack()}
            title="Next"
          >
            <BiSkipNext className="control-icon" />
            <span className="button-label">Next</span>
          </button>
        </div>

        <div className="progress-container">
          <span className="time">{formatTime(progress)}</span>
          <div className="player-progress">
            <input
              type="range"
              min={0}
              max={duration}
              value={progress}
              onChange={(e) => handleSeek(e.target.value)}
            />
          </div>
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>

      <div className="player-right">
        <div className="volume-controls">
          <button onClick={toggleMute}>
            {isMuted ? <BiVolumeMute /> : <BiVolumeFull />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={isMuted ? 0 : volume}
            onChange={(e) => handleVolume(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

export default Player;
