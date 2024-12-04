import React, { useRef, useEffect } from "react";

function AudioPlayer({ trackUrl }) {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  }, [trackUrl]); // Play new track when trackUrl changes

  return (
    <audio ref={audioRef} controls>
      <source src={trackUrl} type="audio/mpeg" />
      Your browser does not support the audio element.
    </audio>
  );
}

export default AudioPlayer;
