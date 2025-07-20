import { useEffect, useState } from "react";

import { useSpotifyAuth } from "./hooks/useSpotifyAuth";
import { formatTime, getCallSpeed } from "./util/helperFunctions";
import TitleDisplay from "./components/TitleDisplay";
import { LyricsDisplay } from "./components/LyricsDisplay";
import type { SpotifyCurrentlyPlaying, SpotifyAudioFeatures, LyricLine, LyricsData } from "./types/spotify";

function App() {
  const [songData, setSongData] = useState<SpotifyCurrentlyPlaying | null>(null);
  const [songAudioData, setSongAudioData] = useState<SpotifyAudioFeatures | null>(null);
  const [lyrics, setLyrics] = useState<LyricLine[] | null>(null);

  const name = songData?.item?.name;
  const artist = songData?.item?.artists.map((a) => a.name).join(", ");
  const trackId = songData?.item?.id;

  const { spotifyApi, token, isAuthenticated, authenticate } = useSpotifyAuth();

  // Check if we're in Electron
  const isElectron = !!(window as { electronAPI?: unknown }).electronAPI || 
                     !!(window as { require?: unknown }).require || 
                     (window.navigator && window.navigator.userAgent.toLowerCase().indexOf('electron') > -1);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    async function fetchData() {
      try {
        const res = await spotifyApi.getMyCurrentPlayingTrack();
        if (res?.item) {
          setSongData(res as SpotifyCurrentlyPlaying);
        } else {
          console.log("No song is currently playing.");
        }
      } catch (err) {
        console.error("❌ Error fetching current track:", err);
      }
    }
    
    if (isAuthenticated && token) {
      fetchData();
      interval = setInterval(fetchData, getCallSpeed(songAudioData?.tempo));
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [songAudioData?.tempo, spotifyApi, isAuthenticated, token]);

  useEffect(() => {
    if (!trackId || !token) return;

    async function fetchTrackData() {
      try {
        const [lyricsRes, audioRes] = await Promise.all([
          fetch(
            `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&market=from_token`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "App-Platform": "WebPlayer",
              },
            }
          ),
          fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "App-Platform": "WebPlayer",
            },
          }),
        ]);

        const lyricsData: LyricsData = await lyricsRes.json();
        const audioData: SpotifyAudioFeatures = await audioRes.json();

        setLyrics(lyricsData?.lyrics?.lines || null);
        setSongAudioData(audioData);
      } catch (err) {
        setLyrics(null);
        console.error("❌ Error fetching track data:", err);
      }
    }

    fetchTrackData();
  }, [trackId, token]);

  // Show authentication required state
  if (!isAuthenticated) {
    return (
      <div className="divContainer">
        <div style={{ 
          textAlign: 'center', 
          padding: '20px', 
          backgroundColor: 'rgba(0, 0, 0, 0.8)', 
          borderRadius: '10px',
          margin: '10px'
        }}>
          <h2 style={{ color: '#1DB954', marginBottom: '15px' }}>🎵 Spotify Login Required</h2>
          
          {isElectron ? (
            <div>
              <p style={{ color: 'white', marginBottom: '15px' }}>
                Right-click the tray icon and select<br/>
                <strong>"Enable Login Mode"</strong> to authenticate
              </p>
              <p style={{ color: '#888', fontSize: '12px' }}>
                Or try the button below (may not work due to overlay settings)
              </p>
              <button 
                onClick={authenticate}
                style={{
                  backgroundColor: '#1DB954',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '10px 20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  marginTop: '10px'
                }}
              >
                Login with Spotify
              </button>
            </div>
          ) : (
            <div>
              <p style={{ color: 'white', marginBottom: '15px' }}>
                Click below to authenticate with Spotify
              </p>
              <button 
                onClick={authenticate}
                style={{
                  backgroundColor: '#1DB954',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  padding: '12px 24px',
                  fontSize: '16px',
                  cursor: 'pointer'
                }}
              >
                Login with Spotify
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="divContainer">
      <TitleDisplay
        name={name}
        artist={artist}
        imageUrl={songData?.item?.album.images[0]?.url}
        progress_ms={songData?.progress_ms}
        formatTime={formatTime}
      />
      <LyricsDisplay songData={songData} lyrics={lyrics} />
    </div>
  );
}

export default App; 