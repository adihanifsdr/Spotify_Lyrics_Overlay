import { useEffect, useRef, useState } from 'react'
import type { SpotifyCurrentlyPlaying, LyricLine } from '../types/spotify'

interface LyricsDisplayProps {
  songData: SpotifyCurrentlyPlaying | null;
  lyrics: LyricLine[] | null;
}

function LyricsDisplay({ songData, lyrics }: LyricsDisplayProps) {
  const lyricsRef = useRef<HTMLDivElement>(null)
  const [currentLyricIndex, setCurrentLyricIndex] = useState<number>(0)

  useEffect(() => {
    if (!lyrics || lyrics.length === 0 || !songData?.progress_ms) return

    // Find the closest lyric that matches song progress
    let currentIndex = lyrics.findIndex(
      (line, index) =>
        songData.progress_ms >= line.startTimeMs &&
        (index === lyrics.length - 1 || songData.progress_ms < lyrics[index + 1].startTimeMs)
    )

    if (currentIndex === -1) {
      setCurrentLyricIndex(0)
    } else {
      setCurrentLyricIndex(currentIndex)
    }
  }, [songData?.progress_ms, lyrics])

  useEffect(() => {
    if (lyricsRef.current) {
      const lyricElements = lyricsRef.current.children

      if (lyricElements[currentLyricIndex]) {
        lyricElements[currentLyricIndex].scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }, [currentLyricIndex])

  return (
    <div className="lyrics-box" ref={lyricsRef}>
      {lyrics === null ? (
        <p>No lyrics...</p>
      ) : (
        lyrics.map((line, index) => (
          <p key={index} className={`lyrics-line ${index === currentLyricIndex ? 'active' : ''}`}>
            {line.words}
          </p>
        ))
      )}
    </div>
  )
}

export { LyricsDisplay } 