import { useEffect, useState } from "react";

import { useSpotifyAuth } from "./hooks/useSpotifyAuth";
import { formatTime, getCallSpeed } from "./util/helperFunctions";
import TitleDisplay from "./components/TitleDisplay";
import { LyricsDisplay } from "./components/LyricsDisplay";
const BEARER_TOKEN = import.meta.env.VITE_BEARER_TOKEN;

function App() {
  const [songData, setSongData] = useState(null);
  const [songAudioData, setSongAudioData] = useState(null);
  const [lyrics, setLyrics] = useState(null);

  const name = songData?.item?.name;
  const artist = songData?.item?.artists.map((a) => a.name).join(", ");
  const trackId = songData?.item?.id;

  const spotifyApi = useSpotifyAuth();

  useEffect(() => {
    let interval;

    async function fetchData() {
      try {
        const res = await spotifyApi.getMyCurrentPlayingTrack();
        if (res?.item) {
          setSongData(res);
        } else {
          console.log("No song is currently playing.");
        }
      } catch (err) {
        console.error("❌ Error fetching current track:", err);
      }
    }
    fetchData();
    interval = setInterval(fetchData, getCallSpeed(songAudioData?.tempo));

    return () => clearInterval(interval);
  }, [songAudioData?.tempo, spotifyApi]);

  useEffect(() => {
    if (!trackId) return;

    async function fetchTrackData() {
      try {
        const [lyricsRes, audioRes] = await Promise.all([
          fetch(
            `https://spclient.wg.spotify.com/color-lyrics/v2/track/${trackId}?format=json&market=from_token`,
            {
              headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`,
                "App-Platform": "WebPlayer",
              },
            }
          ),
          fetch(`https://api.spotify.com/v1/audio-features/${trackId}`, {
            headers: {
              Authorization: `Bearer ${BEARER_TOKEN}`,
              "App-Platform": "WebPlayer",
            },
          }),
        ]);

        const lyricsData = await lyricsRes.json();
        const audioData = await audioRes.json();

        setLyrics(lyricsData?.lyrics?.lines);
        setSongAudioData(audioData);
      } catch (err) {
        setLyrics(null);
        console.error("❌ Error fetching track data:", err);
      }
    }

    fetchTrackData();
  }, [trackId]);

  return (
    <div className="divContainer">
      <TitleDisplay
        name={name}
        artist={artist}
        imageUrl={songData?.item?.album.images[0].url}
        progress_ms={songData?.progress_ms}
        formatTime={formatTime}
      />
      <LyricsDisplay songData={songData} lyrics={lyrics} />
    </div>
  );
}
export default App;
