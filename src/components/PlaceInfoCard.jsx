import React from 'react';
import { X, Star, MapPin, Phone, Globe, Clock, Trash2 } from 'lucide-react';

const PlaceInfoCard = ({ place, onAddToFavorites, onClose, isInFavorites = false }) => {
  if (!place) return null;

  return (
    <div className="absolute top-20 left-4 bg-white rounded-lg shadow-2xl p-4 w-80 z-50 animate-slide-in">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 hover:bg-gray-100 rounded-full"
      >
        <X className="w-5 h-5" />
      </button>

      <h3 className="text-xl font-bold mb-2 pr-8">{place.name}</h3>
      
      <div className="space-y-2 text-sm text-gray-600 mb-4">
        {place.address && (
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{place.address}</span>
          </div>
        )}
        
        {place.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 flex-shrink-0" />
            <span>{place.phone}</span>
          </div>
        )}
        
        {place.website && (
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 flex-shrink-0" />
            <a 
              href={place.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline truncate"
            >
              Visit Website
            </a>
          </div>
        )}

        {place.rating && (
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500 flex-shrink-0" />
            <span>{place.rating} ({place.userRatingsTotal} reviews)</span>
          </div>
        )}

        {place.openNow !== undefined && (
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <div>
              <p className={place.openNow ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                {place.openNow ? "Open now" : "Closed"}
              </p>
            </div>
          </div>
        )}
      </div>

      <button
        onClick={() => onAddToFavorites(place)}
        className={`w-full py-2 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 ${
          isInFavorites 
            ? 'bg-red-600 text-white hover:bg-red-700' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {isInFavorites ? (
          <>
            <Trash2 className="w-4 h-4" />
            Remove from Favorites
          </>
        ) : (
          <>
            <Star className="w-4 h-4" />
            Add to Favorites
          </>
        )}
      </button>
    </div>
  );
};

export default PlaceInfoCard;
