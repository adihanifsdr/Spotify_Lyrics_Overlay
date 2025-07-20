import { useEffect, useState } from "react";
import SpotifyWebApi from "spotify-web-api-js";

const spotifyApi = new SpotifyWebApi();

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID as string;
const REDIRECT_URI = import.meta.env.VITE_SPOTIFY_REDIRECT_URI as string;
const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
const RESPONSE_TYPE = "token";
const SCOPES = "user-read-currently-playing user-read-playback-state";

// Check if we're running in Electron
const isElectron: boolean =
    !!(window as { electronAPI?: unknown }).electronAPI || 
    !!(window as { require?: unknown }).require || 
    (window.navigator && window.navigator.userAgent.toLowerCase().indexOf("electron") > -1);

interface UseSpotifyAuthReturn {
    spotifyApi: typeof spotifyApi;
    token: string | null;
    isAuthenticated: boolean;
    authenticate: () => void;
    getToken: () => string | null;
}

export function useSpotifyAuth(): UseSpotifyAuthReturn {
    const [token, setToken] = useState<string | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    const openSpotifyAuth = (): void => {
        const authUrl = `${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`;

        if (isElectron) {
            // Open in external browser for Electron
            window.open(authUrl, "_blank");
            console.log("🔄 Opening Spotify login in your default browser...");
        } else {
            // Regular web app redirect
            window.location.replace(authUrl);
        }
    };

    useEffect(() => {
        const checkAndSetToken = (): void => {
            const hash = window.location.hash;
            let storedToken = localStorage.getItem("spotify_access_token");
            let expiresAt = localStorage.getItem("spotify_expires_at");

            // Handle OAuth callback
            if (hash) {
                const params = new URLSearchParams(hash.substring(1));
                const newToken = params.get("access_token");
                const expiresIn = params.get("expires_in"); // Token expiration in seconds

                if (newToken && expiresIn) {
                    const newExpiresAt = Date.now() + parseInt(expiresIn) * 1000;
                    window.location.hash = "";

                    localStorage.setItem("spotify_access_token", newToken);
                    localStorage.setItem("spotify_expires_at", newExpiresAt.toString());

                    storedToken = newToken;
                    expiresAt = newExpiresAt.toString();
                    console.log("✅ Successfully authenticated with Spotify!");
                }
            }

            // Check if token exists and is valid
            if (storedToken && expiresAt && Date.now() < parseInt(expiresAt)) {
                setToken(storedToken);
                setIsAuthenticated(true);
                spotifyApi.setAccessToken(storedToken);
                console.log("✅ Using valid Spotify token");
            } else if (storedToken && expiresAt && Date.now() >= parseInt(expiresAt)) {
                // Token expired
                console.log("⏰ Token expired, need to re-authenticate");
                localStorage.removeItem("spotify_access_token");
                localStorage.removeItem("spotify_expires_at");
                setToken(null);
                setIsAuthenticated(false);
            } else {
                // No token found
                console.log("🔐 No valid token found, authentication required");
                setToken(null);
                setIsAuthenticated(false);
            }
        };

        checkAndSetToken();

        // Set up periodic token validation (check every 5 minutes)
        const interval = setInterval(() => {
            const expiresAt = localStorage.getItem("spotify_expires_at");
            if (expiresAt && Date.now() > parseInt(expiresAt) - 60000) {
                // Refresh 1 minute before expiry
                console.log("🔄 Token expiring soon, will need re-authentication...");
                checkAndSetToken();
            }
        }, 5 * 60 * 1000); // Check every 5 minutes

        return () => clearInterval(interval);
    }, []); // ✅ Runs only once when the component mounts

    return {
        spotifyApi,
        token,
        isAuthenticated,
        // Function to manually trigger authentication
        authenticate: openSpotifyAuth,
        // Helper function to get current token
        getToken: (): string | null => localStorage.getItem("spotify_access_token"),
    };
} 