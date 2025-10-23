import React, { useState, useEffect, useRef } from 'react';
import { X, MapPin, Search, Loader2 } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHJhZ2ljY293IiwiYSI6ImNtaDJma3ByajBmMjkyaXI1Y3BpNG1tMjcifQ.UwmYnBz3fczCfJopj-oBHA';

const AddRestaurant = ({ isOpen, onClose, onAdd, onEnableDropPin, droppedPin, prefillData }) => {
  const [mode, setMode] = useState('search'); // 'search' or 'pin'
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisine: '',
    placeId: null // Add placeId to form data
  });
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [error, setError] = useState('');
  const cuisineInputRef = useRef(null);
  const nameInputRef = useRef(null);
  const addressInputRef = useRef(null);

  // Update form when prefillData changes
  useEffect(() => {
    if (prefillData) {
      setFormData({
        name: prefillData.name || '',
        address: prefillData.address || '',
        cuisine: '',
        placeId: prefillData.placeId || null // Store placeId from Google Places
      });
      setSelectedLocation({
        lat: prefillData.lat,
        lng: prefillData.lng
      });
      setMode('search');
    }
  }, [prefillData]);

  // Update selected location when pin is dropped
  useEffect(() => {
    if (droppedPin) {
      setSelectedLocation(droppedPin);
    }
  }, [droppedPin]);

  // Search address with autocomplete
  const handleAddressSearch = async (query) => {
    setFormData({ ...formData, address: query });
    
    if (query.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&limit=5&types=address,poi`
      );
      const data = await response.json();
      setSuggestions(data.features || []);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  // Select address from suggestions
  const selectAddress = (suggestion) => {
    setFormData({ ...formData, address: suggestion.place_name });
    setSelectedLocation({
      lng: suggestion.center[0],
      lat: suggestion.center[1]
    });
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.cuisine) {
      setError('Please fill in all required fields');
      return;
    }

    if (!selectedLocation) {
      setError('Please select a location (drop pin or search address)');
      return;
    }

    const newRestaurant = {
      // Don't include 'id' here - Firestore will generate it
      name: formData.name,
      address: mode === 'search' ? formData.address : `${selectedLocation.lat.toFixed(6)}, ${selectedLocation.lng.toFixed(6)}`,
      cuisine: formData.cuisine,
      lng: selectedLocation.lng,
      lat: selectedLocation.lat,
      placeId: formData.placeId, // Include placeId in the restaurant data
      reviews: []
    };

    onAdd(newRestaurant);
    
    // Reset form
    setFormData({ name: '', address: '', cuisine: '', placeId: null });
    setSelectedLocation(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out animate-slideUp max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-800">Add Restaurant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Mode Tabs */}
          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setMode('search')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                mode === 'search'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <Search size={16} />
              Search Address
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('pin');
                onEnableDropPin();
              }}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2 ${
                mode === 'pin'
                  ? 'bg-white text-primary shadow-sm'
                  : 'text-gray-600'
              }`}
            >
              <MapPin size={16} />
              Drop Pin
            </button>
          </div>

          {/* Location Input */}
          {mode === 'search' ? (
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                ref={addressInputRef}
                type="text"
                value={formData.address}
                onChange={(e) => handleAddressSearch(e.target.value)}
                onFocus={(e) => {
                  if (suggestions.length > 0) setShowSuggestions(true);
                  // Scroll input into view when keyboard appears
                  setTimeout(() => {
                    e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }, 300);
                }}
                placeholder="Start typing address..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
              />
              
              {/* Address Suggestions */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectAddress(suggestion)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-0"
                    >
                      <div className="font-medium text-sm">{suggestion.text}</div>
                      <div className="text-xs text-gray-500">{suggestion.place_name}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              {selectedLocation ? (
                <div className="text-center">
                  <MapPin className="inline text-primary mb-2" size={24} />
                  <div className="text-sm text-gray-600">
                    Pin dropped at:
                  </div>
                  <div className="font-mono text-xs text-gray-500 mt-1">
                    {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-600">
                  <MapPin className="inline text-gray-400 mb-2" size={24} />
                  <div className="text-sm">
                    Tap anywhere on the map to drop a pin
                  </div>
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              ref={nameInputRef}
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              onFocus={(e) => {
                // Scroll input into view when keyboard appears
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
              placeholder="e.g., Bella Napoli"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type *
            </label>
            <input
              ref={cuisineInputRef}
              type="text"
              required
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              onFocus={(e) => {
                // Scroll input into view when keyboard appears
                setTimeout(() => {
                  e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
              placeholder="e.g., Italian, Mexican, Asian"
            />
          </div>

          <button
            type="submit"
            disabled={!selectedLocation}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
          >
            Add Restaurant
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
