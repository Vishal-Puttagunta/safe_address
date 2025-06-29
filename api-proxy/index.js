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
  const apiKey = process.env.WALKSCORE_API_KEY;
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
  const apiKey = process.env.CRIME_API_KEY;
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
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=2000&type=grocery_or_supermarket&key=${process.env.GOOGLE_PLACES_API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'Google Places API error', details: err.message });
  }
});

// OpenWeather Proxy
app.get('/api/weather', async (req, res) => {
  const { lat, lon } = req.query;
  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.OPENWEATHER_KEY}&units=imperial`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'OpenWeather API error', details: err.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`API Proxy server running on port ${PORT}`);
});
