import React, { useRef, useEffect, useState } from 'react';
import { Search, Locate } from 'lucide-react';
import PlaceInfoCard from './PlaceInfoCard';

// google maps api key from .env
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = ({ restaurants, dropPinMode, onPinDrop, onFavorite, onAutoFill, onCheckIfInFavorites }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const pinMarker = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isPlaceInFavorites, setIsPlaceInFavorites] = useState(false);

  useEffect(() => {
    if (map.current) return; // Only initialize once

    const initMap = () => {
      // Initialize Google Map
      map.current = new window.google.maps.Map(mapContainer.current, {
        center: { lat: 41.7151, lng: 44.8271 }, // Tbilisi
        zoom: 13,
        disableDefaultUI: true, // Disable all default UI controls
        zoomControl: false, // No zoom buttons
        mapTypeControl: false, // No map/satellite toggle
        streetViewControl: false, // No Street View pegman
        fullscreenControl: false, // No fullscreen button
        gestureHandling: 'greedy', // Allow pan/zoom without requiring two fingers
      });
      // Add click listener for drop pin mode AND for fetching place details
      map.current.addListener('click', async (e) => {
        const { latLng } = e;
        const lat = latLng.lat();
        const lng = latLng.lng();
        
        if (dropPinMode) {
          // Remove previous pin
          if (pinMarker.current) {
            pinMarker.current.setMap(null);
          }
          // Add new pin marker
          pinMarker.current = new window.google.maps.Marker({
            position: { lat, lng },
            map: map.current,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }
          });
          // Demo save feature: console log pin data
          if (onPinDrop) {
            onPinDrop({ lat, lng });
          } else {
            console.log('Pin dropped at:', { lat, lng });
          }
        } else {
          // Hijack map clicks to show place info using Places API Nearby Search
          try {
            // Use Places API to find nearby places at clicked location
            const response = await fetch(
              `https://places.googleapis.com/v1/places:searchNearby`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
                  'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types'
                },
                body: JSON.stringify({
                  locationRestriction: {
                    circle: {
                      center: {
                        latitude: lat,
                        longitude: lng
                      },
                      radius: 50.0 // 50 meters radius
                    }
                  },
                  maxResultCount: 1
                })
              }
            );
            
            const data = await response.json();
            
            if (data.places && data.places.length > 0) {
              const place = data.places[0];
              
              // Add a temporary marker for the selected place
              if (pinMarker.current) {
                pinMarker.current.setMap(null);
              }
              pinMarker.current = new window.google.maps.Marker({
                position: { 
                  lat: place.location.latitude, 
                  lng: place.location.longitude 
                },
                map: map.current,
                icon: {
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  scaledSize: new window.google.maps.Size(40, 40)
                }
              });
              
              // Prepare place data for info card
              const placeData = {
                name: place.displayName?.text || 'Unknown Place',
                address: place.formattedAddress,
                lat: place.location.latitude,
                lng: place.location.longitude,
                placeId: place.id,
                types: place.types,
                rating: place.rating,
                userRatingCount: place.userRatingCount
              };
              
              console.log('Clicked place:', placeData);
              
              // Check if this place is already in favorites
              if (onCheckIfInFavorites && place.id) {
                const inFavorites = await onCheckIfInFavorites(place.id);
                setIsPlaceInFavorites(inFavorites);
              } else {
                setIsPlaceInFavorites(false);
              }
              
              setSelectedPlace(placeData);
            }
          } catch (err) {
            console.error('Error fetching place at click location:', err);
          }
        }
      });
    };

    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Check if script is already loading
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      existingScript.addEventListener('load', initMap);
      return () => existingScript.removeEventListener('load', initMap);
    }

    // Load Google Maps JS API - ONLY ONE SCRIPT CREATION
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    script.onerror = () => {
      console.error('Failed to load Google Maps API');
    };
    document.head.appendChild(script);
  }, []);

  // Update markers when restaurants change
  useEffect(() => {
    if (!map.current) return;
    
    // Clear existing markers
    markers.current.forEach(m => m.setMap(null));
    markers.current = [];
    
    if (Array.isArray(restaurants)) {
      restaurants.forEach((r) => {
        const marker = new window.google.maps.Marker({
          position: { lat: r.lat, lng: r.lng },
          map: map.current,
          title: r.name,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(32, 32)
          }
        });
        marker.addListener('click', async () => {
          // Show PlaceInfoCard for existing restaurant
          const placeData = {
            name: r.name,
            address: r.address,
            lat: r.lat,
            lng: r.lng,
            placeId: r.placeId,
            tags: r.tags
          };
          
          // Add a temporary marker highlight
          if (pinMarker.current) {
            pinMarker.current.setMap(null);
          }
          pinMarker.current = new window.google.maps.Marker({
            position: { lat: r.lat, lng: r.lng },
            map: map.current,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
              scaledSize: new window.google.maps.Size(40, 40)
            }
          });
          
          // Check if place is in favorites (should be true for existing restaurants)
          if (onCheckIfInFavorites && r.placeId) {
            const inFavorites = await onCheckIfInFavorites(r.placeId);
            setIsPlaceInFavorites(inFavorites);
          } else {
            setIsPlaceInFavorites(true); // Assume true for existing restaurants
          }
          
          setSelectedPlace(placeData);
        });
        markers.current.push(marker);
      });
    }
  }, [restaurants, onFavorite, onAutoFill]);
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
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          input: searchQuery
        }),
        signal: controller.signal
      });
      const data = await response.json();
      console.log('Autocomplete response:', data);
      // New Places API v1 returns 'suggestions' array
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Autocomplete error:', err);
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };
  fetchSuggestions();
  return () => controller.abort();
}, [searchQuery]);

  // Handle Enter key press in search
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (suggestions.length > 0) {
        // Use first suggestion if available
        handleSuggestionClick(suggestions[0]);
      }
    }
  };

  // Handle suggestion click: fetch place details and pan map
  const handleSuggestionClick = async (suggestion) => {
    const displayText = suggestion.placePrediction?.text?.text || 'Unknown';
    setSearchQuery(displayText);
    setShowSuggestions(false);
    
    const placeId = suggestion.placePrediction?.placeId;
    if (!placeId || !map.current) return;
    
    try {
      // Use NEW Places API (New) Place Details to get full info
      const response = await fetch(
        `https://places.googleapis.com/v1/places/${placeId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'id,displayName,formattedAddress,location,rating,userRatingCount,internationalPhoneNumber,websiteUri,regularOpeningHours,types'
          }
        }
      );
      const data = await response.json();
      
      if (data.location) {
        const lat = data.location.latitude;
        const lng = data.location.longitude;
        
        // Pan and zoom to the selected place
        map.current.panTo({ lat, lng });
        map.current.setZoom(17);
        
        // Add a temporary marker for the selected place
        if (pinMarker.current) {
          pinMarker.current.setMap(null);
        }
        pinMarker.current = new window.google.maps.Marker({
          position: { lat, lng },
          map: map.current,
          icon: {
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
            scaledSize: new window.google.maps.Size(40, 40)
          },
          title: displayText
        });
        
        // Prepare place data for info card with rich details
        const placeData = {
          name: data.displayName?.text || displayText,
          address: data.formattedAddress,
          lat,
          lng,
          placeId,
          types: data.types,
          rating: data.rating,
          userRatingCount: data.userRatingCount,
          phone: data.internationalPhoneNumber,
          website: data.websiteUri,
          hours: data.regularOpeningHours
        };
        
        console.log('Selected place from autocomplete:', placeData);
        
        // Check if this place is already in favorites
        if (onCheckIfInFavorites && placeId) {
          const inFavorites = await onCheckIfInFavorites(placeId);
          setIsPlaceInFavorites(inFavorites);
        } else {
          setIsPlaceInFavorites(false);
        }
        
        setSelectedPlace(placeData);
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
    }
  };

  const handleAddToFavorites = (place) => {
    console.log('Adding to favorites:', place);
    setSelectedPlace(null);
    
    // Trigger callbacks for parent component
    if (onFavorite) {
      onFavorite(place);
    }
    if (onAutoFill) {
      onAutoFill(place.name);
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
        style={dropPinMode ? { opacity: 0.5 } : {}}
      >
        <div className="relative">
          <div className="flex items-center bg-white rounded-lg shadow-lg">
            <Search className="absolute left-3 text-gray-400" size={20} />
            <input
              id="google-places-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchKeyPress}
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
                  key={suggestion.placePrediction?.placeId || index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                >
                  <div className="font-medium text-sm">
                    {suggestion.placePrediction?.text?.text || suggestion.placePrediction?.structuredFormat?.mainText?.text || 'Unknown'}
                  </div>
                  <div className="text-xs text-gray-500">
                    {suggestion.placePrediction?.structuredFormat?.secondaryText?.text || ''}
                  </div>
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
        style={dropPinMode ? { opacity: 0.5 } : {}}
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

      {/* Place Info Card */}
      {selectedPlace && (
        <PlaceInfoCard
          place={selectedPlace}
          onAddToFavorites={handleAddToFavorites}
          onClose={() => setSelectedPlace(null)}
          isInFavorites={isPlaceInFavorites}
        />
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
