import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHJhZ2ljY293IiwiYSI6ImNtaDJma3ByajBmMjkyaXI1Y3BpNG1tMjcifQ.UwmYnBz3fczCfJopj-oBHA';

const Map = ({ restaurants, onMarkerClick, selectedRestaurant }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

  useEffect(() => {
    if (map.current) return; // Initialize map only once

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-73.9855, 40.7580], // Default to NYC Times Square
      zoom: 13,
      pitch: 0,
      bearing: 0
    });

    // Add navigation controls (zoom buttons)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

  }, []);

  // Update markers when restaurants change
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers
    restaurants.forEach((restaurant) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'custom-marker';
      el.style.width = '40px';
      el.style.height = '40px';
      el.style.cursor = 'pointer';
      el.style.transition = 'transform 0.2s';
      
      // Restaurant icon SVG
      el.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
          <circle cx="20" cy="20" r="18" fill="${selectedRestaurant?.id === restaurant.id ? '#6366f1' : '#ef4444'}" 
                  stroke="white" stroke-width="3" />
          <text x="20" y="26" font-size="20" text-anchor="middle" fill="white">🍴</text>
        </svg>
      `;

      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)';
      });

      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
      });

      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([restaurant.location.lng, restaurant.location.lat])
        .addTo(map.current);

      // Add click handler
      el.addEventListener('click', () => {
        onMarkerClick(restaurant);
        // Fly to marker
        map.current.flyTo({
          center: [restaurant.location.lng, restaurant.location.lat],
          zoom: 15,
          duration: 1000
        });
      });

      markers.current.push(marker);
    });

  }, [restaurants, onMarkerClick, selectedRestaurant]);

  // Fly to selected restaurant
  useEffect(() => {
    if (selectedRestaurant && map.current) {
      map.current.flyTo({
        center: [selectedRestaurant.location.lng, selectedRestaurant.location.lat],
        zoom: 15,
        duration: 1000
      });
    }
  }, [selectedRestaurant]);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0 }}
    />
  );
};

export default Map;
