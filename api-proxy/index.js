import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());

// Walk Score Proxy
app.get('/api/walkscore', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.REACT_APP_WALKSCORE_API_KEY;
  const url = `https://api.walkscore.com/score?format=json&lat=${lat}&lon=${lon}&wsapikey=${apiKey}`;
  console.log('[WalkScore] Using API Key:', apiKey);
  console.log('[WalkScore] Request URL:', url);
  try {
    const response = await axios.get(url);
    console.log('[WalkScore] API Response:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('[WalkScore] API Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Walk Score API error', details: err.message, apiError: err.response ? err.response.data : null });
  }
});

// Crimeometer Proxy
app.get('/api/crime', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.REACT_APP_CRIME_API_KEY;
  const url = `https://api.crimeometer.com/v1/incidents/raw-data?lat=${lat}&lon=${lon}&distance=1mi&datetime_ini=2024-01-01T00:00:00Z&datetime_end=2024-12-31T23:59:59Z`;
  console.log('[Crime] Using API Key:', apiKey);
  console.log('[Crime] Request URL:', url);
  try {
    const response = await axios.get(url, {
      headers: { 'x-api-key': apiKey }
    });
    console.log('[Crime] API Response:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('[Crime] API Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Crime API error', details: err.message, apiError: err.response ? err.response.data : null });
  }
});

// Google Places Proxy
app.get('/api/grocery', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.REACT_APP_GOOGLE_PLACES_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=2000&type=grocery_or_supermarket&key=${apiKey}`;
  console.log('[Grocery] Using API Key:', apiKey ? 'Present' : 'Missing');
  console.log('[Grocery] Request URL:', url);
  try {
    const response = await axios.get(url);
    console.log('[Grocery] API Status:', response.data.status);
    console.log('[Grocery] Results Count:', response.data.results ? response.data.results.length : 0);
    console.log('[Grocery] Full API Response:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('[Grocery] API Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'Google Places API error', details: err.message, apiError: err.response ? err.response.data : null });
  }
});

// WeatherAPI.com Proxy
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.REACT_APP_WEATHER_KEY;
  const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${lat},${lon}&aqi=no`;
  console.log('[Weather] Using API Key:', apiKey ? 'Present' : 'Missing');
  console.log('[Weather] Request URL:', url);
  try {
    const response = await axios.get(url);
    console.log('[Weather] API Response:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('[Weather] API Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'WeatherAPI error', details: err.message, apiError: err.response ? err.response.data : null });
  }
});

// IQAir Proxy
app.get('/api/airquality', async (req, res) => {
  const { lat, lon } = req.query;
  const apiKey = process.env.REACT_APP_AIR_KEY;
  const url = `http://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lon}&key=${apiKey}`;
  console.log('[AirQuality] Using API Key:', apiKey ? 'Present' : 'Missing');
  console.log('[AirQuality] Request URL:', url);
  try {
    const response = await axios.get(url);
    console.log('[AirQuality] API Response:', response.data);
    res.json(response.data);
  } catch (err) {
    console.error('[AirQuality] API Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ error: 'IQAir API error', details: err.message, apiError: err.response ? err.response.data : null });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`API Proxy server running on port ${PORT}`);
  console.log('Available environment variables:');
  console.log('REACT_APP_WEATHER_KEY:', process.env.REACT_APP_WEATHER_KEY ? 'Present' : 'Missing');
  console.log('REACT_APP_AIR_KEY:', process.env.REACT_APP_AIR_KEY ? 'Present' : 'Missing');
  console.log('REACT_APP_WALKSCORE_API_KEY:', process.env.REACT_APP_WALKSCORE_API_KEY ? 'Present' : 'Missing');
});
