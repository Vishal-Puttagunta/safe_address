"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "./Map.css"
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Map = ({ location, walkScore, crimeScore, groceryScore, airQualityScore, weatherScore, activitiesScore }) => {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const marker = useRef(null)

  useEffect(() => {
    if (map.current) return // Initialize only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-98, 39], // USA center
      zoom: 3,
    })

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), "top-right")
  }, [])

  useEffect(() => {
    if (location && map.current) {
      // Remove existing marker
      if (marker.current) {
        marker.current.remove()
      }

      // Fly to location with smooth animation
      map.current.flyTo({
        center: [location.lon, location.lat],
        zoom: 12,
        duration: 2000,
      })

      // Create custom marker element
      const el = document.createElement("div")
      el.className = "custom-marker"
      el.innerHTML = "📍"

      // Add new marker
      marker.current = new mapboxgl.Marker(el).setLngLat([location.lon, location.lat]).addTo(map.current)
    }
  }, [location])

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Floating scores box */}
      <div style={{
        position: 'absolute',
        top: 20,
        right: 20,
        background: 'white',
        padding: '16px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
        zIndex: 1000,
        minWidth: 180,
        textAlign: 'left',
        fontWeight: 500
      }}>
        <div style={{ marginBottom: 8 }}>Grocery Access: {groceryScore !== null ? groceryScore : '--'}/10</div>
        <div style={{ marginBottom: 8 }}>Air Quality: {airQualityScore !== null ? airQualityScore : '--'}/10</div>
        <div style={{ marginBottom: 8 }}>Weather: {weatherScore !== null ? weatherScore : '--'}/10</div>
        <div>Activities: {activitiesScore !== null ? activitiesScore : '--'}/10</div>
      </div>
      <div ref={mapContainer} className="map-container" />
    </div>
  )
}

export default Map
