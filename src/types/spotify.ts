export interface SpotifyArtist {
  id: string;
  name: string;
  external_urls: {
    spotify: string;
  };
  href: string;
  type: string;
  uri: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{
    height: number;
    url: string;
    width: number;
  }>;
  release_date: string;
  type: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
  href: string;
  popularity: number;
  preview_url: string | null;
  track_number: number;
  type: string;
  uri: string;
}

export interface SpotifyCurrentlyPlaying {
  item: SpotifyTrack | null;
  is_playing: boolean;
  progress_ms: number;
  timestamp: number;
  context: {
    type: string;
    href: string;
    external_urls: {
      spotify: string;
    };
    uri: string;
  } | null;
  device: {
    id: string;
    is_active: boolean;
    is_private_session: boolean;
    is_restricted: boolean;
    name: string;
    type: string;
    volume_percent: number;
  };
}

export interface SpotifyAudioFeatures {
  id: string;
  tempo: number;
  time_signature: number;
  key: number;
  mode: number;
  acousticness: number;
  danceability: number;
  energy: number;
  instrumentalness: number;
  liveness: number;
  loudness: number;
  speechiness: number;
  valence: number;
  duration_ms: number;
}

export interface LyricLine {
  startTimeMs: number;
  words: string;
  syllables?: Array<{
    startTimeMs: number;
    numChars: number;
  }>;
  endTimeMs?: number;
}

export interface LyricsData {
  lyrics: {
    lines: LyricLine[];
    syncType: string;
  };
} 