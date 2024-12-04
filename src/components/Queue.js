import React from "react";
import { useAudio } from "../context/AudioContext";
import "./Queue.css";

function Queue() {
  const { queue, removeFromQueue, clearQueue, playTrack } = useAudio();

  return (
    <div className="queue-container">
      <div className="queue-header">
        <h3>Queue</h3>
        <button onClick={clearQueue}>Clear</button>
      </div>
      <div className="queue-list">
        {queue.map((track) => (
          <div key={track.id} className="queue-item">
            <img src={track.image} alt={track.title} />
            <div className="track-info">
              <h4>{track.title}</h4>
              <p>{track.artist}</p>
            </div>
            <button onClick={() => playTrack(track)}>Play</button>
            <button onClick={() => removeFromQueue(track.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Queue;
