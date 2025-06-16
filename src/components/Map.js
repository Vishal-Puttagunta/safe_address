"use client"

import { useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "./Map.css"

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN

const Map = ({ location }) => {
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

  return <div ref={mapContainer} className="map-container" />
}

export default Map
