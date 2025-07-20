interface TitleDisplayProps {
  name: string | undefined;
  artist: string | undefined;
  imageUrl: string | undefined;
  progress_ms: number | undefined;
  formatTime: (ms: number | undefined) => string;
}

function TitleDisplay({ name, artist, imageUrl, progress_ms, formatTime }: TitleDisplayProps) {
  return (
    <>
      <div className="song-info">
        <img src={decodeURIComponent(imageUrl || '')} alt="Album Cover" className="album-cover" />
        <div className="song-info-text">
          <h2 className="song-title">{name || 'Loading...'}</h2>
          <p className="song-artist">{artist || 'Loading...'}</p>
        </div>
      </div>
      <p className="song-progress">{formatTime(progress_ms)}</p>
    </>
  )
}

export default TitleDisplay 