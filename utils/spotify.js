const axios = require("axios");

require("dotenv").config()

async function getSpotifyAccessToken() {
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
  const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.error("Spotify client credentials are missing.");
    process.exit(1);
  }

  const auth = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString("base64");

  const response = await axios.post(
    "https://accounts.spotify.com/api/token",
    "grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return response.data.access_token;
}

async function searchSpotify(query) {
  const spotifyToken = await getSpotifyAccessToken();

  const responseSearch = await axios.get(
    `https://api.spotify.com/v1/search?q=${query}&type=track&limit=20&offset=0`,
    {
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    }
  );

  return responseSearch.data.tracks.items;
}

function mmssToSeconds(mmss) {
  if (!mmss) return
  const [minutes, seconds] = mmss.split(":").map(Number);
  return minutes * 60 + seconds;
}

module.exports = { getSpotifyAccessToken, searchSpotify, mmssToSeconds };
