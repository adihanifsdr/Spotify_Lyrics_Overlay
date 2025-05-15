import { useEffect } from 'react'
import SpotifyWebApi from 'spotify-web-api-js'

const spotifyApi = new SpotifyWebApi()

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize'
const RESPONSE_TYPE = 'token'
const SCOPES = 'user-read-currently-playing user-read-playback-state'

export function useSpotifyAuth() {
  useEffect(() => {
    const hash = window.location.hash
    let token = localStorage.getItem('spotify_access_token')
    let expiresAt = localStorage.getItem('spotify_expires_at')

    if (hash) {
      const params = new URLSearchParams(hash.substring(1))
      token = params.get('access_token')
      const expiresIn = params.get('expires_in') // Token expiration in seconds
      expiresAt = Date.now() + expiresIn * 1000
      window.location.hash = ''

      localStorage.setItem('spotify_access_token', token)
      localStorage.setItem('spotify_expires_at', expiresAt)
    }

    // ✅ Prevent infinite loops by only redirecting if token is missing or expired
    if (!token || Date.now() > expiresAt) {
      console.log('Token expired, redirecting to login...')
      window.location.replace(
        `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`
      )
    } else {
      spotifyApi.setAccessToken(token)
    }
  }, []) // ✅ Runs only once when the component mounts
  return spotifyApi
}
