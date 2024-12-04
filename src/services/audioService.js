class AudioService {
  constructor() {
    this.audio = new Audio();
    this.currentTrack = null;
  }

  async play(track) {
    try {
      switch (track.sourceType) {
        case "spotify":
          // Use Spotify SDK
          if (window.spotifyPlayer) {
            await window.spotifyPlayer.play(track.spotifyUri);
          }
          break;

        case "local":
          // Play local audio file
          this.audio.src = track.localAudioUrl;
          await this.audio.play();
          break;

        case "youtube":
          // Use YouTube iframe API
          if (window.youtubePlayer) {
            window.youtubePlayer.loadVideoById(track.youtubeId);
          }
          break;
      }
      this.currentTrack = track;
    } catch (error) {
      console.error("Playback error:", error);
    }
  }

  pause() {
    switch (this.currentTrack?.sourceType) {
      case "spotify":
        window.spotifyPlayer?.pause();
        break;
      case "local":
        this.audio.pause();
        break;
      case "youtube":
        window.youtubePlayer?.pauseVideo();
        break;
    }
  }
}

export default new AudioService();
