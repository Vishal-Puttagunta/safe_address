# API Proxy Server

This is a simple Node.js/Express proxy server to handle CORS and secure API keys for your React app.

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```
2. Add your API keys to the `.env` file (already created).
3. Start the server:
   ```sh
   npm start
   ```

The server will run on port 5001 by default.

## Endpoints
- `/api/walkscore?lat=LAT&lon=LON`
- `/api/crime?lat=LAT&lon=LON`
- `/api/grocery?lat=LAT&lon=LON`
- `/api/weather?lat=LAT&lon=LON`

Update your React app to call these endpoints instead of the third-party APIs directly.
