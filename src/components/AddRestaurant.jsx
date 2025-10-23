import React, { useState } from 'react';
import { X, MapPin, Loader2 } from 'lucide-react';

const MAPBOX_TOKEN = 'pk.eyJ1IjoidHJhZ2ljY293IiwiYSI6ImNtaDJma3ByajBmMjkyaXI1Y3BpNG1tMjcifQ.UwmYnBz3fczCfJopj-oBHA';

const AddRestaurant = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    cuisine: ''
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsGeocoding(true);

    try {
      // Geocode the address using Mapbox Geocoding API
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(formData.address)}.json?access_token=${MAPBOX_TOKEN}&limit=1`
      );
      
      const data = await response.json();

      if (!data.features || data.features.length === 0) {
        setError('Address not found. Please try a different address.');
        setIsGeocoding(false);
        return;
      }

      const [lng, lat] = data.features[0].center;

      const newRestaurant = {
        id: Date.now(),
        name: formData.name,
        address: formData.address,
        cuisine: formData.cuisine,
        location: { lat, lng },
        reviews: []
      };

      onAdd(newRestaurant);
      
      // Reset form
      setFormData({ name: '', address: '', cuisine: '' });
      onClose();
      
    } catch (err) {
      setError('Failed to geocode address. Please try again.');
      console.error('Geocoding error:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-t-3xl shadow-2xl transform transition-transform duration-300 ease-out animate-slideUp">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Add Restaurant</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Restaurant Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
              placeholder="e.g., Bella Napoli"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
                placeholder="e.g., 123 Main St, New York, NY"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cuisine Type *
            </label>
            <select
              required
              value={formData.cuisine}
              onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-lg"
            >
              <option value="">Select cuisine...</option>
              <option value="Italian">Italian</option>
              <option value="Japanese">Japanese</option>
              <option value="Chinese">Chinese</option>
              <option value="Mexican">Mexican</option>
              <option value="Indian">Indian</option>
              <option value="American">American</option>
              <option value="French">French</option>
              <option value="Thai">Thai</option>
              <option value="Mediterranean">Mediterranean</option>
              <option value="Korean">Korean</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isGeocoding}
            className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isGeocoding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Finding location...
              </>
            ) : (
              'Add Restaurant'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRestaurant;
