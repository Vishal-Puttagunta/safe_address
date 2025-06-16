import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "./Map.css";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const Map = ({ location }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);

  useEffect(() => {
    if (map.current) return; // Initialize only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [-98, 39], // USA center
      zoom: 3,
    });
  }, []);

  useEffect(() => {
    if (location && map.current) {
      map.current.flyTo({
        center: [location.lon, location.lat],
        zoom: 12,
      });

      new mapboxgl.Marker()
        .setLngLat([location.lon, location.lat])
        .addTo(map.current);
    }
  }, [location]);

  return <div ref={mapContainer} className="map-container" />;
};

export default Map;
