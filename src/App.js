import React, { useState } from "react";
import Map from "./components/Map";
import axios from "axios";
import "./App.css";

function App() {
  const [zipcode, setZipcode] = useState("");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);

  const handleSearch = async () => {
    try {
      // 1️⃣ Geocode ZIP using Mapbox
      const geoRes = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipcode}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
      );
      const [lon, lat] = geoRes.data.features[0].center;
      setLocation({ lat, lon });

      // 2️⃣ Get weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_KEY}&units=imperial`
      );
      setWeather(weatherRes.data);

    } catch (err) {
      console.error(err);
      alert("Error finding location");
    }
  };

  return (
    <div className="App">
      <h1>ZIP Code Ratings</h1>
      <input
        value={zipcode}
        onChange={(e) => setZipcode(e.target.value)}
        placeholder="Enter ZIP Code"
      />
      <button onClick={handleSearch}>Search</button>

      <Map location={location} />

      {weather && (
        <div className="ratings">
          <h2>Weather</h2>
          <p>Temp: {weather.main.temp}°F</p>
          <p>Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;
