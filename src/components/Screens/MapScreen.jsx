import React from 'react';
import Map from '../Map';

/**
 * MapScreen - Wraps the existing Map component
 * This keeps the Map component completely isolated and unchanged
 */
const MapScreen = ({ 
  restaurants, 
  selectedRestaurant,
  dropPinMode, 
  onMapClick,
  onMarkerClick,
  onFavorite, 
  onAutoFill, 
  onCheckIfInFavorites,
  showListView,
  onListViewToggle,
  restaurantList,
  onRemoveRestaurant,
  onRestaurantSelect,
  currentUser,
  onConfirmDelete
}) => {
  return (
    <div className="relative w-full h-full">
      <Map
        restaurants={restaurants}
        selectedRestaurant={selectedRestaurant}
        dropPinMode={dropPinMode}
        onMapClick={onMapClick}
        onMarkerClick={onMarkerClick}
        onFavorite={onFavorite}
        onAutoFill={onAutoFill}
        onCheckIfInFavorites={onCheckIfInFavorites}
      />

      {/* List View Button - Moved here but unchanged */}
      <div className="fixed bottom-28 right-6 z-30">
        <button
          onClick={onListViewToggle}
          className="w-14 h-14 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center active:scale-95"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* List View Overlay - Moved from App.jsx */}
      {showListView && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl shadow-2xl max-h-[70vh] flex flex-col animate-slideUp">
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
            </div>
            
            <div className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">
                  Restaurants ({restaurants.length})
                </h2>
                <button
                  onClick={onListViewToggle}
                  className="text-primary font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 px-6 py-4">
              {restaurantList && restaurantList.length > 0 ? (
                <div className="space-y-3">
                  {restaurantList}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No restaurants added yet
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapScreen;
