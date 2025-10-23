import React, { useState } from 'react';
import { Plus, List } from 'lucide-react';
import Map from './components/Map';
import AddRestaurant from './components/AddRestaurant';
import RestaurantDetail from './components/RestaurantDetail';
import { initialRestaurants } from './data';

function App() {
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [dropPinMode, setDropPinMode] = useState(false);
  const [droppedPin, setDroppedPin] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  const handleAddRestaurant = (newRestaurant) => {
    setRestaurants([...restaurants, newRestaurant]);
    // Automatically select the newly added restaurant
    setSelectedRestaurant(newRestaurant);
    setDropPinMode(false);
    setDroppedPin(null);
  };

  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowListView(false);
  };

  const handleAddReview = (restaurantId, review) => {
    setRestaurants(restaurants.map(r => 
      r.id === restaurantId 
        ? { ...r, reviews: [...r.reviews, review] }
        : r
    ));
    
    // Update selected restaurant if it's the one being reviewed
    if (selectedRestaurant?.id === restaurantId) {
      setSelectedRestaurant({
        ...selectedRestaurant,
        reviews: [...selectedRestaurant.reviews, review]
      });
    }
  };

  const handleCloseDetail = () => {
    setSelectedRestaurant(null);
  };

  const handleMapClick = (location) => {
    if (dropPinMode) {
      setDroppedPin(location);
    }
  };

  const handleEnableDropPin = () => {
    setDropPinMode(true);
    setDroppedPin(null);
  };

  const handleCloseAddModal = () => {
    setShowAddModal(false);
    setDropPinMode(false);
    setDroppedPin(null);
    setPrefillData(null);
  };

  const handleFavorite = (place) => {
    console.log('Favorite clicked:', place);
    // Prefill the add restaurant form and open modal
    setPrefillData(place);
    setShowAddModal(true);
  };

  const handleAutoFill = (name) => {
    console.log('Auto-fill name:', name);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Map */}
      <Map 
        restaurants={restaurants} 
        onMarkerClick={handleMarkerClick}
        selectedRestaurant={selectedRestaurant}
        dropPinMode={dropPinMode}
        onMapClick={handleMapClick}
        onFavorite={handleFavorite}
        onAutoFill={handleAutoFill}
      />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* List View Button */}
        <button
          onClick={() => setShowListView(!showListView)}
          className="w-14 h-14 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center active:scale-95"
        >
          <List className="w-6 h-6" />
        </button>
        
        {/* Add Restaurant Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:shadow-xl hover:bg-indigo-700 transition-all flex items-center justify-center active:scale-95"
        >
          <Plus className="w-7 h-7" />
        </button>
      </div>

      {/* List View Overlay */}
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
                  onClick={() => setShowListView(false)}
                  className="text-primary font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
            
            <div className="overflow-y-auto flex-1 px-6 py-4">
              <div className="space-y-3">
                {restaurants.map((restaurant) => (
                  <button
                    key={restaurant.id}
                    onClick={() => {
                      handleMarkerClick(restaurant);
                      setShowListView(false);
                    }}
                    className="w-full bg-gray-50 hover:bg-gray-100 rounded-lg p-4 text-left transition"
                  >
                    <h3 className="font-semibold text-gray-800 text-lg mb-1">
                      {restaurant.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                        {restaurant.cuisine}
                      </span>
                      <span className="text-sm text-gray-500">
                        {restaurant.reviews.length} review{restaurant.reviews.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddRestaurant 
        isOpen={showAddModal}
        onClose={handleCloseAddModal}
        onAdd={handleAddRestaurant}
        onEnableDropPin={handleEnableDropPin}
        droppedPin={droppedPin}
        prefillData={prefillData}
      />

      {selectedRestaurant && (
        <RestaurantDetail
          restaurant={selectedRestaurant}
          onClose={handleCloseDetail}
          onAddReview={handleAddReview}
        />
      )}
    </div>
  );
}

export default App;
