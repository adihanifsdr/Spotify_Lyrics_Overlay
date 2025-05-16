<p align="center">
  <img src="./src/assets/icon.png" width="100" alt="Lyrics Overlay logo" />
</p>

<h1 align="center">Spotify Lyrics Overlay</h1>
<p align="center"><strong>Live-synced Spotify lyrics overlay for desktop.</strong></p>

<p align="center">
  <img src="https://img.shields.io/badge/status-beta-yellow" />
  <img src="https://img.shields.io/badge/license-MIT-green" />
  <img src="https://img.shields.io/badge/electron-%5E28.0.0-blue" />
  <img src="https://img.shields.io/badge/react-%5E18.0.0-blue" />
</p>

<p align="center">
  <a href="#introduction">Introduction</a> · 
  <a href="#installation">Installation</a> · 
  <a href="#disclaimers">Disclaimers</a> · 
  <a href="#license">License</a> 
</p>

## Introduction

Lyrics Overlay displays synced Spotify lyrics as an always-on-top desktop overlay. It runs alongside any app — great for karaoke, music study, or just enhancing your listening experience.

## Installation

This project requires **Node.js** installed on your machine.

### 🧩 Step-by-Step Setup

1.  **Clone the repository**  
    Follow [GitHub's cloning instructions](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository) or run:
    ```bash
    git clone https://github.com/Nicolas-Arias3142/Spotify_Lyrics_Overlay.git
    cd Spotify_Lyrics_Overlay
    ```
2.  **Install dependencies**
    ```bash
    npm install
    ```
3.  **Set up your `.env` file**

        Create a [Spotify Developer account](https://developer.spotify.com)

        Create a new project in the Spotify Developer Dashboard

        Copy `.env.example` and rename it to .env

        In the `.env` file, set the following values:

        ```bash
        VITE_BEARER_TOKEN=fresh bearer token
        VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id
        VITE_SPOTIFY_REDIRECT_URI=http://localhost:{your redirect port}
        VITE_PORT={same port as redirect url}
        ```

        **_How to get bearer token_**

        - Open your browser and open _Developer Tools_ by clicking F12
        - Navigate to the _Network_ tab inside your _Developer Tools_ and filter using `Fetch/XHR`
        - Then visit https://open.spotify.com/ and make sure that you already logged in and pick any song with lyrics and open the lyrics view on spotify
        - Spotify changed it so you have to click through the requests and look for `

    https://spclient.wg.spotify.com/color-lyrics/v2` in the `Headers` section - In the `Request Headers` look for Authorization: Bearer - Copy the token after the word Bearer and add to VITE_BEARER_TOKEN

        - Make sure the redirect URI is also added to your Spotify app settings

4.  **Start the app**
    ```bash
    npm run start
    ```
    Once running, the app will launch in Electron and begin displaying synced lyrics for your currently playing Spotify track.

## Disclaimers

If you run and you have to log into spotify through the program, close the program and go to `public/electron.cjs` read the comments in the createWindow function.

After every 30min - 1hr it will say **_*No lyrics found*_** that means you need a fresh bearer token and restart program. I have not added auto grab for the token but am planning to for the future.

## License

This application is licensed under the [MIT license](https://github.com/Nicolas-Arias3142/Spotify_Lyrics_Overlay/blob/main/LICENSE).
