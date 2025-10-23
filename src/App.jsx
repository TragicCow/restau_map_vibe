import React, { useState, useEffect } from 'react';
import { List, Trash2, User } from 'lucide-react';
import Map from './components/Map';
import AddRestaurant from './components/AddRestaurant';
import RestaurantDetail from './components/RestaurantDetail';
import UserSelector, { USERS } from './components/UserSelector';
import { 
  getAllRestaurants, 
  addRestaurant, 
  getRestaurantByPlaceId,
  deleteRestaurant 
} from './firebase/firestore';

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showListView, setShowListView] = useState(false);
  const [dropPinMode, setDropPinMode] = useState(false);
  const [droppedPin, setDroppedPin] = useState(null);
  const [prefillData, setPrefillData] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  // Load restaurants from Firebase when user is selected
  useEffect(() => {
    if (currentUser) {
      loadRestaurants();
    }
  }, [currentUser]);

  const loadRestaurants = async () => {
    setLoading(true);
    try {
      console.log('Loading restaurants from Firestore...');
      const data = await getAllRestaurants();
      console.log('Loaded restaurants:', data);
      setRestaurants(data);
    } catch (error) {
      console.error('Error loading restaurants:', error);
      console.error('Error details:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleAddRestaurant = async (newRestaurant) => {
    try {
      // Check if restaurant already exists by placeId
      if (newRestaurant.placeId) {
        const existing = await getRestaurantByPlaceId(newRestaurant.placeId);
        if (existing) {
          alert('This restaurant is already in favorites!');
          return;
        }
      }

      const addedRestaurant = await addRestaurant(newRestaurant, currentUser.id);
      setRestaurants([addedRestaurant, ...restaurants]);
      setSelectedRestaurant(addedRestaurant);
      setDropPinMode(false);
      setDroppedPin(null);
      setShowAddModal(false);
      setPrefillData(null);
    } catch (error) {
      console.error('Error adding restaurant:', error);
      alert('Failed to add restaurant. Please try again.');
    }
  };

  const handleRemoveRestaurant = async (restaurantId) => {
    try {
      await deleteRestaurant(restaurantId);
      setRestaurants(restaurants.filter(r => r.id !== restaurantId));
      setSelectedRestaurant(null);
    } catch (error) {
      console.error('Error removing restaurant:', error);
      alert('Failed to remove restaurant. Please try again.');
    }
  };

  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
    setShowListView(false);
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

  const handleFavorite = async (place) => {
    console.log('Favorite clicked:', place);
    console.log('Place placeId:', place.placeId);
    
    try {
      // Check if restaurant already exists
      if (place.placeId) {
        const existing = await getRestaurantByPlaceId(place.placeId);
        console.log('Existing restaurant found:', existing);
        if (existing) {
          // Remove from favorites
          console.log('Removing restaurant with ID:', existing.id);
          await deleteRestaurant(existing.id);
          setRestaurants(restaurants.filter(r => r.id !== existing.id));
          return;
        }
      }
      
      // Prefill the add restaurant form and open modal
      setPrefillData(place);
      setShowAddModal(true);
    } catch (error) {
      console.error('Error in handleFavorite:', error);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      alert('Failed to process request. Please try again.');
    }
  };

  const handleAutoFill = (name) => {
    console.log('Auto-fill name:', name);
  };

  const handleCheckIfInFavorites = async (placeId) => {
    if (!placeId) return false;
    const existing = await getRestaurantByPlaceId(placeId);
    return existing !== null;
  };

  // Show user selector if no user is selected
  if (!currentUser) {
    return <UserSelector onSelectUser={handleUserSelect} />;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

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
        onCheckIfInFavorites={handleCheckIfInFavorites}
      />

      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-40">
        {/* List View Button */}
        <button
          onClick={() => setShowListView(!showListView)}
          className="w-14 h-14 bg-white text-gray-700 rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center active:scale-95"
        >
          <List className="w-6 h-6" />
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
                {restaurants.map((restaurant) => {
                  const restaurantUser = USERS.find(u => u.id === restaurant.userId);
                  return (
                    <div
                      key={restaurant.id}
                      className="w-full bg-gray-50 rounded-lg p-4 transition relative"
                    >
                      <div 
                        onClick={() => {
                          handleMarkerClick(restaurant);
                          setShowListView(false);
                        }}
                        className="cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-800 text-lg flex-1">
                            {restaurant.name}
                          </h3>
                          {restaurantUser && (
                            <div 
                              className="flex items-center gap-1 px-2 py-1 rounded-full text-white text-xs"
                              style={{ backgroundColor: restaurantUser.color }}
                              title={`Added by ${restaurantUser.name}`}
                            >
                              <User size={12} />
                              <span>{restaurantUser.name}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{restaurant.address}</p>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                            {restaurant.cuisine}
                          </span>
                          <span className="text-sm text-gray-500">
                            {restaurant.reviews?.length || 0} review{restaurant.reviews?.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                      </div>
                      
                      {/* Remove button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm(`Remove "${restaurant.name}" from favorites?`)) {
                            handleRemoveRestaurant(restaurant.id);
                          }
                        }}
                        className="absolute bottom-4 right-4 p-2 text-red-500 hover:bg-red-50 rounded-full transition"
                        title="Remove from favorites"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  );
                })}
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
          currentUser={currentUser}
        />
      )}
    </div>
  );
}

export default App;
