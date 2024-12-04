import React, { useState, useEffect } from "react";
import "./MainContent.css";
import { BiSearch, BiHeart, BiShare } from "react-icons/bi";
import { useAudio } from "../context/AudioContext";
import SpotifyEmbed from "./SpotifyEmbed";
import PlaylistDetails from "./PlaylistDetails";

// Add these function definitions before your component
const cachePlaylistsForOffline = async (playlists) => {
  try {
    // Add your caching logic here
    console.log("Caching playlists for offline use:", playlists);
  } catch (error) {
    console.error("Error caching playlists:", error);
  }
};

const generateShareLink = (playlistId) => {
  return `${window.location.origin}/playlist/${playlistId}`;
};

// Add this constant at the top of your file for song tracks
const SPOTIFY_TRACKS = {
  // K-Pop Songs
  BUTTER: "2bgTY4UwhfBYhGT4HUYStN",
  DYNAMITE: "4saklk6nie3yiGePpBwUoc",
  SPRING_DAY: "2u8HeneQsmPmRQNihqDWPb",
  BOY_WITH_LUV: "5KawlOMHjWeUjQtnuRs22c",
  FAKE_LOVE: "0c9zs5YcKzNEYtrZH3y0mE",

  // Pop Songs
  STAY: "5PjdY0CKGZdEuoNab3yDmX",
  LEVITATING: "39LLxExYz6ewLAcYrzQQyP",
  BLINDING_LIGHTS: "0VjIjW4GlUZAMYd2vXMi3b",
  AS_IT_WAS: "4LRPiXqCikLlN15c3yImP7",
  ANTI_HERO: "0V3wPSX9ygBnCm8psDIegu",

  // Rock Songs
  BOHEMIAN_RHAPSODY: "3z8h0TU7ReDPLIbEnYhWZb",
  SWEET_CHILD: "7o2CTH4ctstm8TNelqjb51",
  STAIRWAY: "5CQ30WqJwcep0pYcV4AMNc",
  DREAM_ON: "5MxNLUsfh7uzROypsoO5qe",

  // Hip Hop Songs
  GODS_PLAN: "6DCZcSspjsKoFjzjrWoCdn",
  HUMBLE: "7KXjTSCq5nL1LoYtL7XAwS",
  ALRIGHT: "3kxfsdsCpFgN412fpnW85Y",
  STRONGER: "6zf5BfwH1sODYGZQUz1W6H",
};

function MainContent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [playlists, setPlaylists] = useState([
    {
      id: 1,
      name: "Today's Top Hits",
      spotifyId: "37i9dQZF1DXcBWIGoYBM5M",
      image:
        "https://4kwallpapers.com/images/wallpapers/bts-v-bts-k-pop-singers-south-korean-boy-band-3840x2160-8174.jpg",
      category: "Popular",
    },
    {
      id: 2,
      name: "K-Pop Hits",
      spotifyId: "37i9dQZF1DX9tPFwDMOaN1",
      image:
        "https://world.seoul.go.kr/wp-content/uploads/2023/06/2023-BTS-FESTA-001.jpg",
      category: "K-Pop",
    },
    {
      id: 3,
      name: "Rock Classics",
      spotifyId: "37i9dQZF1DWXRqgorJj26U",
      image: "https://i.scdn.co/image/ab67616100005174e03a98785f3658f0b6461ec4",
      category: "Rock",
    },
    {
      id: 4,
      name: "Hip Hop Mix",
      spotifyId: "37i9dQZF1DX0XUsuxWHRQd",
      image: "https://i.scdn.co/image/ab6761610000e5eb5ba2d75eb08a2d672f9b69b7",
      category: "Hip Hop",
    },
    {
      id: 5,
      name: "Jazz Vibes",
      spotifyId: "37i9dQZF1DX4wta20PHgwo",
      image: "https://i.scdn.co/image/ab6761610000e5eb9e528993a2820267b97f6aae",
      category: "Jazz",
    },
    {
      id: 6,
      name: "Electronic Dance",
      spotifyId: "37i9dQZF1DX4dyzvuaRJ0n",
      image: "https://i.scdn.co/image/ab6761610000e5ebe053b8338322b9c8609ee7ae",
      category: "EDM",
    },
    {
      id: 7,
      name: "Acoustic Favorites",
      spotifyId: "37i9dQZF1DX4E3UdUs7fUx",
      image: "https://i.scdn.co/image/ab67616d00001e0279b8d5f5821bddae3bc5e6a9",
      category: "Acoustic",
    },
    {
      id: 8,
      name: "Classical Essentials",
      spotifyId: "37i9dQZF1DWWEJlAGA9gs0",
      image: "https://i.scdn.co/image/ab6761610000e5eb571bd5587850d252e8fc892d",
      category: "Classical",
    },
    {
      id: 9,
      name: "Workout Beats",
      spotifyId: "37i9dQZF1DX70RN3TfWWJh",
      image: "https://i.scdn.co/image/ab6761610000e5eb58b4b9419486550f6fda0535",
      category: "Workout",
    },
    {
      id: 10,
      name: "Party Mix",
      spotifyId: "37i9dQZF1DXa2PvUpywmrr",
      image:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84d17550bcf5e2c2a43a89efb0",
      category: "Party",
    },
    {
      id: 11,
      name: "Sleep Sounds",
      spotifyId: "37i9dQZF1DWZd79rJ6a7lp",
      image: "https://i.scdn.co/image/ab6761610000e5ebc3c753851496854e29abff7a",
      category: "Sleep",
    },
    {
      id: 12,
      name: "Bollywood Beats",
      spotifyId: "37i9dQZF1DX0XUfTFmNBRM",
      image: "https://i.scdn.co/image/ab67616100005174b99cacf8acd5378206767261",
      category: "Bollywood",
    },
    {
      id: 13,
      name: "Latin Vibes",
      spotifyId: "37i9dQZF1DX10zKzsJ2jva",
      image: "https://i.scdn.co/image/ab67616d00001e022e8ed79e177ff6011076f5f0",
      category: "Latin",
    },
    {
      id: 14,
      name: "Gaming Mix",
      spotifyId: "37i9dQZF1DWTyiBJ6yEqeu",
      image: "https://i.scdn.co/image/ab6761610000e5ebcab652097be01bf194cdf11d",
      category: "Gaming",
    },
    {
      id: 15,
      name: "Indie Discoveries",
      spotifyId: "37i9dQZF1DX2Nc3B70tvx0",
      image: "https://i.scdn.co/image/ab6761610000e5eb26e8cb3ff6fc7744b312811b",
      category: "Indie",
    },
    {
      id: 16,
      name: "Metal Mayhem",
      spotifyId: "37i9dQZF1DWTcqUzwhNmKv",
      image: "https://i.scdn.co/image/ab6761610000e5ebe0b37426761bbaa441615c5b",
      category: "Metal",
    },
    {
      id: 17,
      name: "Country Roads",
      spotifyId: "37i9dQZF1DX1lVhptIYRda",
      image: "https://i.scdn.co/image/ab67616d00001e022a038d3bf875d23e4aeaa84e",
      category: "Country",
    },
    {
      id: 18,
      name: "Reggae Sunshine",
      spotifyId: "37i9dQZF1DXbSbnqxMTGx9",
      image: "https://i.scdn.co/image/ab6761610000e5eb57138b98e7ddd5a86ee97a9b",
      category: "Reggae",
    },
    {
      id: 19,
      name: "Blues & Soul",
      spotifyId: "37i9dQZF1DXd9rSDyQguIk",
      image: "https://i.scdn.co/image/ab6761610000e5ebc9690bc711d04b3d4fd4b87c",
      category: "Blues",
    },
    {
      id: 20,
      name: "Meditation",
      spotifyId: "37i9dQZF1DWZqd5JICZI0u",
      image:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84fe373362560eff20af800c2c",
      category: "Wellness",
    },
    {
      id: 21,
      name: "Piano Pieces",
      spotifyId: "37i9dQZF1DX4sWSpwq3LiO",
      image: "https://i.scdn.co/image/ab67616d00001e02330f11fb125bb80b760f9e19",
      category: "Instrumental",
    },
    {
      id: 22,
      name: "Punk Rock",
      spotifyId: "37i9dQZF1DX0KpeLFwA3tO",
      image: "https://i.scdn.co/image/ab6761610000e5eb76470faf6330235edbcb90a9",
      category: "Punk",
    },
  ]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [following, setFollowing] = useState([]);

  // Add sorting and filtering functions
  const sortPlaylists = (items) => {
    return [...items].sort((a, b) => a.name.localeCompare(b.name));
  };

  const filterPlaylists = (items) => {
    return items.filter(
      (item) =>
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query.trim() === "") {
      setSearchResults([]);
      return;
    }

    const results = playlists.filter(
      (playlist) =>
        playlist.name.toLowerCase().includes(query) ||
        playlist.category.toLowerCase().includes(query)
    );
    setSearchResults(results);
  };

  const handlePlayTrack = async (playlist, trackId = null) => {
    try {
      // Get device ID
      const deviceId = localStorage.getItem("spotify_device_id");
      if (!deviceId) {
        alert("Please open Spotify app first");
        return;
      }

      // Get access token
      const token = localStorage.getItem("spotify_token");
      if (!token) {
        alert("Please login to Spotify");
        return;
      }

      // Play track or playlist
      const playBody = trackId
        ? {
            uris: [`spotify:track:${trackId}`],
          }
        : {
            context_uri: `spotify:playlist:${playlist.spotifyId}`,
          };

      await fetch(
        `https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(playBody),
        }
      );
    } catch (error) {
      console.error("Error playing track:", error);
      if (error.message.includes("PREMIUM_REQUIRED")) {
        alert("This feature requires Spotify Premium");
      }
    }
  };

  // Offline mode
  const handleOfflineToggle = () => {
    setIsOfflineMode(!isOfflineMode);
    if (!isOfflineMode) {
      // Logic for enabling offline mode
      cachePlaylistsForOffline(playlists);
    }
  };

  // Social features
  const followUser = async (userId) => {
    try {
      await fetch(`${process.env.REACT_APP_API_URL}/users/follow/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("spotify_token")}`,
        },
      });
      setFollowing((prev) => [...prev, userId]);
    } catch (error) {
      console.error("Error following user:", error);
    }
  };

  const sharePlaylist = async (playlist) => {
    try {
      // Generate sharing link
      const shareLink = await generateShareLink(playlist.id);

      // Use Web Share API if available
      if (navigator.share) {
        await navigator.share({
          title: playlist.name,
          text: `Check out this playlist: ${playlist.name}`,
          url: shareLink,
        });
      } else {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareLink);
        alert("Share link copied to clipboard!");
      }
    } catch (error) {
      console.error("Error sharing playlist:", error);
    }
  };

  // Update the following functionality
  const handleFollowToggle = (playlistId) => {
    setFollowing((prev) => {
      if (prev.includes(playlistId)) {
        return prev.filter((id) => id !== playlistId);
      }
      return [...prev, playlistId];
    });
  };

  // Update the renderPlaylistCard function
  const renderPlaylistCard = (playlist) => (
    <div className="playlist-card">
      <div className="playlist-info">
        <h3>{playlist.name}</h3>
        <span className="category-tag">{playlist.category}</span>
      </div>
      <iframe
        src={`https://open.spotify.com/embed/playlist/${playlist.spotifyId}?utm_source=generator&theme=0`}
        width="100%"
        height="380"
        frameBorder="0"
        allowFullScreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
        style={{ borderRadius: "12px" }}
      />
    </div>
  );

  return (
    <div className="main-content">
      {selectedPlaylist ? (
        <PlaylistDetails
          playlist={selectedPlaylist}
          onBack={() => setSelectedPlaylist(null)}
        />
      ) : (
        <>
          <div className="search-container">
            <BiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search for playlists..."
              value={searchQuery}
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <div className="content-section">
            <div className="playlists-grid">
              {sortPlaylists(
                filterPlaylists(searchQuery ? searchResults : playlists)
              ).map((playlist, index) => renderPlaylistCard(playlist, index))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default MainContent;
