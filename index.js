const express = require("express");
const cors = require('cors');
const axios = require('axios'); // Import the axios library for making HTTP requests
const app = express();

app.use(express.json());
app.use(cors());

// const getCityCoordinates = async (city) => {
//   try {
//     const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${city}`);
//     const geoData = await geoRes.json();
//     if (geoData.results && geoData.results.length > 0) {
//       const { latitude, longitude } = geoData.results[0];
//       return { latitude, longitude }; // Return an object
//     } else {
//       throw new Error(`Coordinates for "${city}" not found.`);
//     }
//   } catch (error) {
//     console.error("Error fetching coordinates:", error);
//     throw new Error(`Failed to fetch coordinates for "${city}"`);
//   }
// };



app.post("/places", async (req, res) => {
  const { city } = req.body;

  console.log("Inside post!")

  const options = {
    method: 'GET',
    //url: 'https://api.content.tripadvisor.com/api/v1/location/search?key=AE6907DEB101496C81FE650DCD5FB7A4&searchQuery=Seattle&category=attractions&language=en',
    url: 'https://api.content.tripadvisor.com/api/v1/location/293928/details?key=AE6907DEB101496C81FE650DCD5FB7A4&language=en',
    headers: {accept: 'application/json', 'Referer': 'https://www.railway.com'},
    
    
  };
  
  axios
    .request(options)
    .then(res => console.log(res.data))
    .catch(err => console.error(err));


  
  console.log("Microservice received:", { city});

  if (!city) {
    return res.status(400).json({ error: "Invalid request format: city is required" });
  }

});





app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`places microservice running on port ${PORT}`);
});