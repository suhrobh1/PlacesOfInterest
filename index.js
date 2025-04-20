const express = require("express");
const cors = require("cors");
const axios = require("axios"); // Import the axios library for making HTTP requests
const app = express();

app.use(express.json());
app.use(cors());

// Code for getting the lat and long.
const getCityCoordinates = async (city) => {
  try {
    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
    const geoData = await geoRes.json();
    if (geoData.results && geoData.results.length > 0) {
      const { latitude, longitude } = geoData.results[0];
      return { latitude, longitude }; // Return an object
    } else {
      throw new Error(`Coordinates for "${city}" not found.`);
    }
  } catch (error) {
    console.error("Error fetching coordinates:", error);
    throw new Error(`Failed to fetch coordinates for "${city}"`);
  }
};

app.post("/places", async (req, res) => {
  const { city } = req.body;

  console.log("Microservice received:", { city });

  if (!city) {
    return res.status(400).json({ error: "Invalid request format: city is required" });
  }

  try {
    const { latitude, longitude } = await getCityCoordinates(city);

    const foursquareRes = await axios.get("https://api.foursquare.com/v3/places/search", {
      headers: {
        Authorization: "fsq3uDkptSDSbHS+pVTqTZBvfjl9Zx3Ak/xlUXC9v8rAeAU=",
      },
      params: {
        ll: `${latitude},${longitude}`,
        radius: 5000,
        categories: "16000", // Landmarks, museums, historical buildings
        limit: 20,
      },
    });

    const places = foursquareRes.data.results.map((place) => ({
      name: place.name,
      address: place.location?.formatted_address || "",
      categories: place.categories?.map((c) => c.name) || [],
      distance: place.distance,
      lat: place.geocodes?.main?.latitude,
      lng: place.geocodes?.main?.longitude,
    }));

    res.status(200).json({
      city,
      coordinates: { latitude, longitude },
      places,
    });
  } catch (error) {
    console.error("Error fetching places:", error.message);
    res.status(500).json({ error: "Failed to fetch places of interest" });
  }
});

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`places microservice running on port ${PORT}`);
});
