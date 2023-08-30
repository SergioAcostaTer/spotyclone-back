const express = require("express");
const { searchSpotify, mmssToSeconds } = require("../utils/spotify");

const router = express.Router();

require("dotenv").config();
router.get("/search/:query", async (req, res) => {
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


// get yt link from spotify song

// const yt = require("ytsr");

// router.get("/search/:title/:artist/:time", async (req, res) => {
//   const { title, artist, time } = req.params;

//   try {
//     const filters = await yt.getFilters(`${title} ${artist}`);
//     const filter = filters.get("Type").get("Video");

//     const searchOptions = {
//       limit: 10,
//     };

//     const searchResults = await yt(filter.url, searchOptions);

//     let bestResult = null;
//     let minTimeDiff = Infinity;
//     let durations = {};

//     for (const video of searchResults.items) {
//       const songDuration = time;
//       const videoDuration = mmssToSeconds(video.duration);
//       const timeDiff = Math.abs(videoDuration - songDuration);

//       if (timeDiff < minTimeDiff) {
//         minTimeDiff = timeDiff;
//         bestResult = video;
//         duration = {
//           youtube: videoDuration,
//           spotify:  Number(songDuration),
//         };
//       }
//     }

//     res.json({
//       title: bestResult.title,
//       url: bestResult.url,
//       views: bestResult.views,
//       duration,
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while processing your request." });
//   }
// });

module.exports = router;
