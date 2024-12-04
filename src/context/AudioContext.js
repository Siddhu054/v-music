import React, { createContext, useState, useContext, useRef } from "react";
import SpotifyService from "../services/spotifyService";

const AudioContext = createContext();

export function AudioProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState("none");
  const [queue, setQueue] = useState([]);
  const audioRef = useRef(new Audio());

  const tracks = [
    {
      id: 1,
      title: "Today's Top Hits",
      artist: "Various Artists",
      image:
        "https://4kwallpapers.com/images/wallpapers/bts-v-bts-k-pop-singers-south-korean-boy-band-3840x2160-8174.jpg",
      audioUrl: "/songs/song1.mp3",
    },
    {
      id: 2,
      title: "Discover Weekly",
      artist: "Various Artists",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT22wKeoUWPy6twgqNj_8bVcnPNLxLzKmV9Xg&s",
      audioUrl: "/songs/song2.mp3",
    },
    // Add more tracks matching ALL your playlist names
  ];

  const playTrack = async (track) => {
    try {
      console.log("Attempting to play track:", track);
      if (!track.audioUrl) {
        console.error("No audio URL found for track:", track);
        return;
      }

      if (currentTrack?.id === track.id) {
        console.log("Same track - toggling play/pause");
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          await audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        console.log("New track - loading and playing");
        if (currentTrack) {
          audioRef.current.pause();
        }
        audioRef.current.src = track.audioUrl;
        try {
          await audioRef.current.play();
          setCurrentTrack(track);
          setIsPlaying(true);
        } catch (error) {
          console.error("Audio playback error:", error);
        }
      }
    } catch (error) {
      console.error("Playback error:", error);
    }
  };

  const pauseTrack = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  const nextTrack = () => {
    if (!currentTrack) return;

    if (repeat === "one") {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      return;
    }

    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    let nextIndex;

    if (shuffle) {
      nextIndex = Math.floor(Math.random() * queue.length);
    } else {
      nextIndex = (currentIndex + 1) % queue.length;
    }

    if (
      nextIndex === 0 &&
      repeat === "none" &&
      currentIndex === queue.length - 1
    ) {
      pauseTrack();
      return;
    }

    playTrack(queue[nextIndex]);
  };

  const previousTrack = () => {
    if (!currentTrack) return;
    const currentIndex = queue.findIndex(
      (track) => track.id === currentTrack.id
    );
    const previousIndex = (currentIndex - 1 + queue.length) % queue.length;
    playTrack(queue[previousIndex]);
  };

  const seekTo = (value) => {
    const time = (value * audioRef.current.duration) / 100;
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
    if (!shuffle) {
      const shuffledQueue = [...queue].sort(() => Math.random() - 0.5);
      setQueue(shuffledQueue);
    }
  };

  const toggleRepeat = () => {
    const modes = ["none", "all", "one"];
    const currentIndex = modes.indexOf(repeat);
    setRepeat(modes[(currentIndex + 1) % modes.length]);
  };

  const addToQueue = (track) => {
    setQueue((prev) => [...prev, track]);
  };

  const removeFromQueue = (trackId) => {
    setQueue((prev) => prev.filter((track) => track.id !== trackId));
  };

  const clearQueue = () => {
    setQueue([]);
  };

  React.useEffect(() => {
    const audio = audioRef.current;

    const timeUpdateHandler = () => {
      setCurrentTime(audio.currentTime);
    };

    const loadedDataHandler = () => {
      setDuration(audio.duration);
    };

    const endedHandler = () => {
      nextTrack();
    };

    audio.addEventListener("timeupdate", timeUpdateHandler);
    audio.addEventListener("loadeddata", loadedDataHandler);
    audio.addEventListener("ended", endedHandler);

    return () => {
      audio.removeEventListener("timeupdate", timeUpdateHandler);
      audio.removeEventListener("loadeddata", loadedDataHandler);
      audio.removeEventListener("ended", endedHandler);
    };
  }, [currentTrack]);

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        isPlaying,
        duration,
        currentTime,
        volume,
        shuffle,
        repeat,
        queue,
        tracks,
        playTrack,
        pauseTrack,
        nextTrack,
        previousTrack,
        seekTo,
        setVolume,
        toggleShuffle,
        toggleRepeat,
        addToQueue,
        removeFromQueue,
        clearQueue,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  return useContext(AudioContext);
}
