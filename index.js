require("dotenv").config()
const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());

const { searchSpotify, mmssToSeconds } = require("./utils/spotify");
// const { getColorFromURL } = require("color-thief-node");



app.get("/search/:query", async (req, res) => {
  const { query } = req.params;

  try {
    const spotifyResults = await searchSpotify(query);

    const formatedSpotifyResults = await Promise.all(
      spotifyResults.map(async (item) => {
        const dominantColor = await getColorFromURL(item.album.images[0].url);
        const color = dominantColor
          .map((c) => c.toString(16).padStart(2, "0"))
          .join("");

        return {
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
          // color: `#${color}`,
        };
      })
    );

    res.json(formatedSpotifyResults);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});


const yt = require("ytsr");

app.get("/search/:title/:artist/:time", async (req, res) => {
  const { title, artist, time } = req.params;

  try {
    // const filters = await yt.getFilters(`${title} ${artist}`);
    console.log(`${title} ${artist}`)
    // const filter = await filters.get("Type").get("Video");

    const searchOptions = {
      limit: 10,
    };

    const searchResults = await yt(`${title} ${artist}`, searchOptions);

    let bestResult = null;
    let minTimeDiff = Infinity;
    let duration = {};

    for (const video of searchResults.items) {
      const songDuration = time;
      const videoDuration = mmssToSeconds(video.duration);
      const timeDiff = Math.abs(videoDuration - songDuration);

      if (timeDiff < minTimeDiff) {
        minTimeDiff = timeDiff;
        bestResult = video;
        duration = {
          youtube: videoDuration,
          spotify: Number(songDuration),
        };
      }
    }

    res.json({
      title: bestResult.title,
      url: bestResult.url,
      views: bestResult.views,
      duration,
    });
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
