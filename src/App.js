import React, { useEffect } from "react";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";
import Player from "./components/Player";
import { AudioProvider } from "./context/AudioContext";

function App() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return (
    <AudioProvider>
      <div className="app">
        <div className="main-container">
          <Sidebar />
          <MainContent />
        </div>
        <Player />
      </div>
    </AudioProvider>
  );
}

export default App;
