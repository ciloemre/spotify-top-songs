import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const CLIENT_ID = "8a0d4bc53feb46ec8b73157d4c8a7950";
const CLIENT_SECRET = "c9f1fa7b3cde442a8ff20a1527ccd07a";
const PLAYLIST_ID = "37i9dQZEVXbIVYVBNw9D5K";

function App() {
  const [accessToken, setAccessToken] = useState("");
  const [topTracks, setTopTracks] = useState([]);
  const [currentlyPlaying, setCurrentlyPlaying] = useState("");
  const audioRef = useRef(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      const authParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      };

      try {
        const response = await fetch(
          "https://accounts.spotify.com/api/token",
          authParameters
        );
        const data = await response.json();
        setAccessToken(data.access_token);
      } catch (error) {
        console.error("Error fetching access token:", error);
      }
    };

    fetchAccessToken();
  }, []);

  useEffect(() => {
    const fetchTopTracks = async () => {
      if (accessToken) {
        const searchParameters = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        try {
          const response = await fetch(
            `https://api.spotify.com/v1/playlists/${PLAYLIST_ID}/tracks?limit=50`,
            searchParameters
          );
          const data = await response.json();
          if (data && data.items) {
            const tracks = data.items.map((item) => item.track);
            setTopTracks(tracks);
          }
        } catch (error) {
          console.error("Error fetching top tracks:", error);
        }
      }
    };

    fetchTopTracks();
  }, [accessToken]);

  const playPreview = (previewUrl) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    setCurrentlyPlaying(previewUrl);
    audioRef.current = new Audio(previewUrl);
    audioRef.current.play();
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setCurrentlyPlaying("");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Türkiye Top 50</h1>
      <div className="tracks-list">
        {topTracks.map((track) => (
          <div key={track.id} className="track-item">
            <div className="track-info">
              {track.name} -{" "}
              {track.artists.map((artist) => artist.name).join(", ")}
            </div>
            <button
              className="play-button"
              onClick={() => playPreview(track.preview_url)}
            >
              Çal
            </button>
            {currentlyPlaying === track.preview_url && (
              <button className="stop-button" onClick={stopPreview}>
                Durdur
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
