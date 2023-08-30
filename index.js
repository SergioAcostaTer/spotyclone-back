require("dotenv").config()
const express = require('express');
const cors = require('cors');
const { searchSpotify } = require("./utils/spotify");

const app = express();
const port = 3000;

app.use(cors());

// const search = require("./routes/spotify")


require("dotenv").config();
app.get("/search/:query", async (req, res) => {
  const { query } = req.params;

  try {
    const spotifyResults = await searchSpotify(query);

    const formatedSpotifyResults = spotifyResults.map((item) => ({
      title: item.name,
      artist: item.artists[0].name,
      allArtists: item.artists.map((artist) => artist.name),
      spotifyUrl: item.external_urls.spotify,
      id: item.id,
      thumbnail: item.album.images[0].url,
      thumbnailSmall: item.album.images.slice(-1)[0]?.url,
      duration: item.duration_ms,
      popularity: item.popularity,
      type: "track",
    }));
    console.log(spotifyResults);

    res.json(formatedSpotifyResults);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

app.get('/', (req, res) => {
  res.send('Hello, Express App!');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
