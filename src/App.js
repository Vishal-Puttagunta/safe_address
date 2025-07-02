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
  const [walkScore, setWalkScore] = useState(null)
  const [crimeScore, setCrimeScore] = useState(null)
  const [groceryScore, setGroceryScore] = useState(null)
  const [airQualityScore, setAirQualityScore] = useState(null)
  const [weatherScore, setWeatherScore] = useState(null)
  const [activitiesScore, setActivitiesScore] = useState(null)

  // Helper: Normalize Walk Score (0-100) to 1-10
  const normalizeWalkScore = (score) => Math.max(1, Math.round(score / 10))
  // Helper: Normalize crime rate (lower = higher score, example logic)
  const normalizeCrimeScore = (rate) => {
    if (rate == null) return null
    // Example: 0-100 crimes per 1000 people => 10-1
    if (rate <= 5) return 10
    if (rate <= 10) return 8
    if (rate <= 20) return 6
    if (rate <= 40) return 4
    if (rate <= 60) return 2
    return 1
  }
  // Helper: Normalize grocery count to 1-10 (example: 0-20+ stores)
  const normalizeGroceryScore = (count) => {
    if (count >= 20) return 10
    if (count >= 15) return 8
    if (count >= 10) return 6
    if (count >= 5) return 4
    if (count >= 2) return 2
    return 1
  }
  // Helper: Normalize air quality AQI to 1-10 (lower AQI = higher score)
  const normalizeAirQualityScore = (aqi) => {
    if (aqi <= 50) return 10    // Good
    if (aqi <= 100) return 8    // Moderate
    if (aqi <= 150) return 6    // Unhealthy for Sensitive Groups
    if (aqi <= 200) return 4    // Unhealthy
    if (aqi <= 300) return 2    // Very Unhealthy
    return 1                    // Hazardous
  }
  // Helper: Normalize weather conditions to 1-10 (based on temperature and conditions)
  const normalizeWeatherScore = (temp, condition) => {
    // Temperature scoring (Fahrenheit)
    let tempScore = 0;
    if (temp >= 65 && temp <= 75) tempScore = 10;      // Perfect temperature
    else if (temp >= 60 && temp <= 80) tempScore = 8;  // Good temperature
    else if (temp >= 50 && temp <= 85) tempScore = 6;  // Acceptable temperature
    else if (temp >= 40 && temp <= 90) tempScore = 4;  // Uncomfortable
    else if (temp >= 30 && temp <= 95) tempScore = 2;  // Very uncomfortable
    else tempScore = 1;                                 // Extreme temperatures
    
    // Condition scoring
    let conditionScore = 10;
    const badConditions = ['rain', 'snow', 'sleet', 'storm', 'thunder', 'fog', 'mist'];
    const moderateConditions = ['cloudy', 'overcast', 'drizzle'];
    
    const conditionLower = condition.toLowerCase();
    if (badConditions.some(bad => conditionLower.includes(bad))) {
      conditionScore = 3;
    } else if (moderateConditions.some(mod => conditionLower.includes(mod))) {
      conditionScore = 6;
    }
    
    // Average the scores
    return Math.round((tempScore + conditionScore) / 2);
  }
  // Helper: Normalize activities/events count to 1-10
  const normalizeActivitiesScore = (count) => {
    if (count >= 50) return 10    // Excellent variety
    if (count >= 30) return 8     // Great variety
    if (count >= 20) return 6     // Good variety
    if (count >= 10) return 4     // Moderate variety
    if (count >= 5) return 2      // Limited variety
    return 1                      // Very few activities
  }

  const fetchScores = async (lat, lon) => {
    // Walk Score API via proxy
    try {
      const walkRes = await axios.get(`http://localhost:5001/api/walkscore?lat=${lat}&lon=${lon}`)
      const score = normalizeWalkScore(walkRes.data.walkscore)
      setWalkScore(score)
      console.log('Walk Score:', walkRes.data.walkscore, 'Normalized:', score)
    } catch (e) {
      setWalkScore(null)
      console.log('Walk Score error:', e)
    }
    // Crime API via proxy
    try {
      const crimeRes = await axios.get(`http://localhost:5001/api/crime?lat=${lat}&lon=${lon}`)
      const crimeRate = crimeRes.data.incidents ? crimeRes.data.incidents.length : 0
      const score = normalizeCrimeScore(crimeRate)
      setCrimeScore(score)
      console.log('Crime Rate:', crimeRate, 'Normalized:', score)
    } catch (e) {
      setCrimeScore(null)
      console.log('Crime Score error:', e)
    }
    // Google Places API for groceries via proxy
    try {
      const placesRes = await axios.get(`http://localhost:5001/api/grocery?lat=${lat}&lon=${lon}`)
      const count = placesRes.data.results ? placesRes.data.results.length : 0
      const score = normalizeGroceryScore(count)
      setGroceryScore(score)
      console.log('Grocery Count:', count, 'Normalized:', score)
    } catch (e) {
      setGroceryScore(null)
      console.log('Grocery Score error:', e)
    }
    // IQAir API for air quality via proxy
    try {
      const airRes = await axios.get(`http://localhost:5001/api/airquality?lat=${lat}&lon=${lon}`)
      const aqi = airRes.data.data ? airRes.data.data.current.pollution.aqius : null
      const score = normalizeAirQualityScore(aqi)
      setAirQualityScore(score)
      console.log('Air Quality AQI:', aqi, 'Normalized:', score)
    } catch (e) {
      setAirQualityScore(null)
      console.log('Air Quality Score error:', e)
    }
    // WeatherAPI.com for weather score via proxy
    try {
      const weatherRes = await axios.get(`http://localhost:5001/api/weather?lat=${lat}&lon=${lon}`)
      const temp = weatherRes.data.current ? weatherRes.data.current.temp_f : null
      const condition = weatherRes.data.current ? weatherRes.data.current.condition.text : null
      const score = normalizeWeatherScore(temp, condition)
      setWeatherScore(score)
      console.log('Weather Temp:', temp, 'Condition:', condition, 'Normalized:', score)
    } catch (e) {
      setWeatherScore(null)
      console.log('Weather Score error:', e)
    }
    // SerpAPI for activities/events via proxy
    try {
      const eventsRes = await axios.get(`http://localhost:5001/api/events?lat=${lat}&lon=${lon}`)
      console.log('Full Events Response:', eventsRes.data)
      
      // Try different possible response structures
      let count = 0;
      if (eventsRes.data.events_results && eventsRes.data.events_results.length > 0) {
        count = eventsRes.data.events_results.length;
      } else if (eventsRes.data.events && eventsRes.data.events.length > 0) {
        count = eventsRes.data.events.length;
      } else if (eventsRes.data.local_results && eventsRes.data.local_results.length > 0) {
        count = eventsRes.data.local_results.length;
      }
      
      const score = normalizeActivitiesScore(count)
      setActivitiesScore(score)
      console.log('Activities Count:', count, 'Normalized:', score)
    } catch (e) {
      setActivitiesScore(null)
      console.log('Activities Score error:', e)
    }
  }

  const handleSearch = async () => {
    if (!zipcode.trim()) {
      setError("Please enter a ZIP code")
      return
    }

    setLoading(true)
    setError("")
    setWalkScore(null)
    setCrimeScore(null)
    setGroceryScore(null)
    setAirQualityScore(null)
    setWeatherScore(null)
    setActivitiesScore(null)

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
      
      // 2️⃣ Fetch scores - this handles its own errors for each API
      await fetchScores(lat, lon)
      
      // 3️⃣ Get weather via proxy - independent of scores
      try {
        const weatherRes = await axios.get(
          `http://localhost:5001/api/weather?lat=${lat}&lon=${lon}`
        )
        setWeather(weatherRes.data)
      } catch (weatherErr) {
        console.error('Weather API error:', weatherErr)
        setWeather(null)
        // Don't reset scores for weather API failure
      }
    } catch (err) {
      console.error(err)
      setError("Error finding location. Please check your ZIP code and try again.")
      // Only reset scores if geocoding fails
      setWalkScore(null)
      setCrimeScore(null)
      setGroceryScore(null)
      setAirQualityScore(null)
      setWeatherScore(null)
      setActivitiesScore(null)
      setWeather(null)
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
              <Map location={location} walkScore={walkScore} crimeScore={crimeScore} groceryScore={groceryScore} airQualityScore={airQualityScore} weatherScore={weatherScore} activitiesScore={activitiesScore} />
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
                          <span className="temp-value">{Math.round(weather.current.temp_f)}°F</span>
                        </div>
                        <div className="feels-like">
                          <span className="feels-label">Feels like</span>
                          <span className="feels-value">{Math.round(weather.current.feelslike_f)}°F</span>
                        </div>
                      </div>
                    </div>

                    {/* Condition */}
                    <div className="weather-condition">
                      <span className="condition-icon">☁️</span>
                      <div className="condition-info">
                        <span className="condition-label">Condition</span>
                        <span className="condition-value">{weather.current.condition.text}</span>
                      </div>
                    </div>

                    {/* Additional Info */}
                    <div className="weather-details">
                      <div className="detail-item">
                        <span className="detail-label">Humidity</span>
                        <span className="detail-value">{weather.current.humidity}%</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">Wind Speed</span>
                        <span className="detail-value">{weather.current.wind_mph} mph</span>
                      </div>
                    </div>

                    {/* Location Name */}
                    <div className="location-info">
                      <span className="location-label">Location</span>
                      <span className="location-name">{weather.location.name}, {weather.location.region}</span>
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
