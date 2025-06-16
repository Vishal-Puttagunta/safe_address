"use client"

import { useState } from "react"
import Map from "./components/Map"
import axios from "axios"
import "./App.css"

function App() {
  const [zipcode, setZipcode] = useState("")
  const [location, setLocation] = useState(null)
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSearch = async () => {
    if (!zipcode.trim()) {
      setError("Please enter a ZIP code")
      return
    }

    setLoading(true)
    setError("")

    try {
      // 1️⃣ Geocode ZIP using Mapbox
      const geoRes = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${zipcode}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`,
      )

      if (!geoRes.data.features.length) {
        throw new Error("ZIP code not found")
      }

      const [lon, lat] = geoRes.data.features[0].center
      setLocation({ lat, lon })

      // 2️⃣ Get weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.REACT_APP_OPENWEATHER_KEY}&units=imperial`,
      )
      setWeather(weatherRes.data)
    } catch (err) {
      console.error(err)
      setError("Error finding location. Please check your ZIP code and try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="App">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-icon">📍</div>
            <h1>Safe Address</h1>
            <span className="subtitle">ZIP Code Explorer</span>
          </div>
        </div>
      </header>

      <main className="main-content">
        {/* Search Section */}
        <section className="search-section">
          <div className="search-card">
            <div className="search-header">
              <h2>Explore Any Location</h2>
              <p>Enter a ZIP code to view location details and current weather</p>
            </div>

            <div className="search-form">
              <div className="input-group">
                <span className="input-icon">🔍</span>
                <input
                  type="text"
                  value={zipcode}
                  onChange={(e) => setZipcode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Enter ZIP Code (e.g., 10001)"
                  className="search-input"
                  disabled={loading}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={loading || !zipcode.trim()}
                className={`search-button ${loading ? "loading" : ""}`}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Searching...
                  </>
                ) : (
                  <>🔍 Search Location</>
                )}
              </button>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Map Section - Always visible */}
        <section className="map-section">
          <div className="map-card">
            <div className="card-header">
              <span className="card-icon">🗺️</span>
              <h3>Location Map</h3>
            </div>
            <div className="card-content">
              <Map location={location} />
            </div>
          </div>
        </section>

        {/* Results Section */}
        {(location || weather) && (
          <section className="results-section">
            <div className="results-grid">
              {/* Weather Section */}
              {weather && (
                <div className="weather-card">
                  <div className="card-header">
                    <span className="card-icon">🌤️</span>
                    <h3>Current Weather</h3>
                  </div>

                  <div className="weather-content">
                    {/* Temperature */}
                    <div className="weather-main">
                      <div className="temp-section">
                        <span className="temp-icon">🌡️</span>
                        <div className="temp-info">
                          <span className="temp-label">Temperature</span>
                          <span className="temp-value">{Math.round(weather.main.temp)}°F</span>
                        </div>
                        <div className="feels-like">
                          <span className="feels-label">Feels like</span>
                          <span className="feels-value">{Math.round(weather.main.feels_like)}°F</span>
                        </div>
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="weather-condition">
                      <span className="condition-icon">☁️</span>
                      <div className="condition-info">
                        <span className="condition-label">Condition</span>
                        <span className="condition-value">{weather.weather[0].description}</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="weather-details">
                      <div className="detail-item">
                        <span className="detail-label">Humidity</span>
                        <span className="detail-value">{weather.main.humidity}%</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Pressure</span>
                        <span className="detail-value">{weather.main.pressure} hPa</span>
                      </div>
                    </div>

                    {/* Location Name */}
                    <div className="location-info">
                      <span className="location-label">Location</span>
                      <span className="location-name">{weather.name}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
