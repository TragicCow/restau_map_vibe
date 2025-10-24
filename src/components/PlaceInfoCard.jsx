import React from 'react';
import { X, Star, MapPin, Phone, Globe, Clock, Trash2, ExternalLink } from 'lucide-react';

const PlaceInfoCard = ({ place, onAddToFavorites, onClose, isInFavorites = false }) => {
  if (!place) return null;

  // Generate Google Maps URL
  const googleMapsUrl = place.placeId 
    ? `https://www.google.com/maps/place/?q=place_id:${place.placeId}`
    : `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}`;

  return (
    <div className="absolute left-0 right-0 bg-white rounded-t-2xl shadow-2xl p-5 z-50 animate-slide-up max-w-md mx-auto" style={{ bottom: '80px' }}>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-full transition"
      >
        <X className="w-5 h-5 text-gray-600" />
      </button>

      <h3 className="text-xl font-bold mb-1 pr-8 text-gray-800">{place.name}</h3>
      
      {place.tags && place.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {place.tags.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {place.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <span className="line-clamp-2">{place.address}</span>
          </div>
        )}
        
        {place.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <a href={`tel:${place.phone}`} className="text-blue-600 hover:underline">
              {place.phone}
            </a>
          </div>
        )}
        
        {place.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 flex-shrink-0 text-gray-400" />
            <a 
              href={place.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate flex items-center gap-1"
            >
              Visit Website
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {place.rating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <span className="font-medium">{place.rating}</span>
            {place.userRatingCount && (
              <span className="text-gray-400">({place.userRatingCount} reviews)</span>
            )}
          </div>
        )}

        {place.openNow !== undefined && (
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" />
            <div>
              <p className={place.openNow ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {place.openNow ? "Open now" : "Closed"}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onAddToFavorites(place)}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
            isInFavorites 
              ? 'bg-red-600 text-white hover:bg-red-700' 
              : 'bg-primary text-white hover:bg-indigo-700'
          }`}
        >
          {isInFavorites ? (
            <>
              <Trash2 className="w-4 h-4" />
              Remove
            </>
          ) : (
            <>
              <Star className="w-4 h-4" />
              Add to Favorites
            </>
          )}
        </button>
        
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="py-3 px-4 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
        >
          <ExternalLink className="w-4 h-4" />
          Open
        </a>
      </div>
    </div>
  );
};

export default PlaceInfoCard;
