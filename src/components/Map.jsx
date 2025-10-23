import React, { useRef, useEffect, useState } from 'react';
import { Search, Locate } from 'lucide-react';

// google maps api key from .env
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = ({ restaurants, onMarkerClick, selectedRestaurant, dropPinMode, onMapClick }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    if (map.current) return; // Only initialize once

    // Dynamically load Google Maps JS API (for map only)
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.onload = () => {
      // Initialize Google Map
      map.current = new window.google.maps.Map(mapContainer.current, {
        center: { lat: 41.7151, lng: 44.8271 }, // Tbilisi
        zoom: 13,
        disableDefaultUI: false,
      });
    };
    document.body.appendChild(script);

    return () => {
      if (script) document.body.removeChild(script);
    };
  }, []);
  // Places API autocomplete fetch
  useEffect(() => {
    if (searchQuery.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const controller = new AbortController();
    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          `/api/places?query=${encodeURIComponent(searchQuery)}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (data.status === 'OK') {
          setSuggestions(data.predictions);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }
    };
    fetchSuggestions();
    return () => controller.abort();
  }, [searchQuery]);
  // Handle suggestion click: fetch place details and pan map
  const handleSuggestionClick = async (suggestion) => {
    setSearchQuery(suggestion.description);
    setShowSuggestions(false);
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/details/json?place_id=${suggestion.place_id}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (data.status === 'OK' && data.result.geometry && data.result.geometry.location && map.current) {
        map.current.panTo({
          lat: data.result.geometry.location.lat,
          lng: data.result.geometry.location.lng
        });
        map.current.setZoom(15);
      }
    } catch (err) {
      // ignore
    }
  };

  // Remove Mapbox click handler effect (handled in Google Maps init above)

  // Remove Mapbox cursor effect (handled in Google Maps init above)

  // Remove Mapbox marker effect (handled in Google Maps init above)

  // Remove Mapbox flyTo effect (handled in Google Maps marker click above)

  // Remove Mapbox search/autocomplete (handled by Google Places Autocomplete above)

  // Remove Mapbox flyToLocation (handled by Google Maps above)

  // Get current location (Google Maps version)
  const getCurrentLocation = () => {
    if ('geolocation' in navigator && map.current) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          map.current.panTo({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          map.current.setZoom(14);
        },
        (error) => {
          alert('Could not get your location. Please enable location services.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Search Bar (Google Places Autocomplete) */}
      <div
        className="absolute top-4 left-4 right-4 z-10"
        style={dropPinMode ? { pointerEvents: 'none', opacity: 0.5 } : {}}
      >
        <div className="relative">
          <div className="flex items-center bg-white rounded-lg shadow-lg">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              id="google-places-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search places..."
              className="w-full pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              disabled={dropPinMode}
              autoComplete="off"
            />
          </div>
          {/* Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && !dropPinMode && (
            <div className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl max-h-64 overflow-y-auto z-20">
              {suggestions.map((suggestion, index) => (
                <div
                  key={suggestion.place_id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-sm">{suggestion.structured_formatting.main_text}</div>
                  <div className="text-xs text-gray-500">{suggestion.description}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Current Location Button */}
      <button
        onClick={getCurrentLocation}
        className="absolute top-20 right-4 z-10 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 active:scale-95 transition-transform"
        style={dropPinMode ? { pointerEvents: 'none', opacity: 0.5 } : {}}
        disabled={dropPinMode}
      >
        <Locate size={20} className="text-primary" />
      </button>

      {/* Drop Pin Mode Indicator */}
      {dropPinMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-2 rounded-full shadow-lg z-10 text-sm font-medium">
          📍 Tap map to drop pin
        </div>
      )}

      <div
        ref={mapContainer}
        className="w-full h-full"
        style={{ position: 'absolute', top: 0, left: 0 }}
      />
    </div>
  );
};

export default Map;
