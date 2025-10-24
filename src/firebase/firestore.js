// Firestore service for restaurant/favorites operations
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc,
  addDoc, 
  updateDoc, 
  query, 
  where,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from './config';

const RESTAURANTS_COLLECTION = 'restaurants';
const REVIEWS_COLLECTION = 'reviews';

// ==================== RESTAURANTS ====================

/**
 * Get all non-deleted restaurants
 */
export const getAllRestaurants = async () => {
  try {
    // Get all restaurants (simpler query, no compound index needed)
    const snapshot = await getDocs(collection(db, RESTAURANTS_COLLECTION));
    const restaurants = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(r => r.deleted !== true); // Filter out deleted ones in memory
    
    // Sort by createdAt in memory
    return restaurants.sort((a, b) => {
      const timeA = a.createdAt?.toMillis?.() || 0;
      const timeB = b.createdAt?.toMillis?.() || 0;
      return timeB - timeA; // Descending order
    });
  } catch (error) {
    console.error('Error getting restaurants:', error);
    console.error('Error details:', error.message);
    return [];
  }
};

/**
 * Check if restaurant with placeId already exists
 */
export const getRestaurantByPlaceId = async (placeId) => {
  try {
    const q = query(
      collection(db, RESTAURANTS_COLLECTION),
      where('placeId', '==', placeId)
    );
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) return null;
    
    // Filter out deleted ones in memory (to avoid composite index)
    const nonDeletedDocs = snapshot.docs.filter(doc => doc.data().deleted !== true);
    
    if (nonDeletedDocs.length === 0) return null;
    
    return { id: nonDeletedDocs[0].id, ...nonDeletedDocs[0].data() };
  } catch (error) {
    console.error('Error checking restaurant:', error);
    console.error('Error details:', error.message);
    return null;
  }
};

/**
 * Add restaurant to favorites
 */
export const addRestaurant = async (restaurantData, userId) => {
  try {
    // Clean out undefined values - Firestore doesn't accept undefined
    const cleanedData = Object.fromEntries(
      Object.entries(restaurantData).filter(([_, value]) => value !== undefined)
    );

    const docRef = await addDoc(collection(db, RESTAURANTS_COLLECTION), {
      ...cleanedData,
      userId,
      deleted: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...cleanedData, userId, deleted: false };
  } catch (error) {
    console.error('Error adding restaurant:', error);
    throw error;
  }
};

/**
 * Soft delete restaurant (mark as deleted)
 */
export const deleteRestaurant = async (restaurantId) => {
  try {
    console.log('Attempting to delete restaurant with ID:', restaurantId);
    console.log('ID type:', typeof restaurantId);
    console.log('ID value:', JSON.stringify(restaurantId));
    
    if (!restaurantId || typeof restaurantId !== 'string') {
      throw new Error(`Invalid restaurant ID: ${restaurantId}. Expected a string.`);
    }
    
    const docRef = doc(db, RESTAURANTS_COLLECTION, restaurantId);
    await updateDoc(docRef, {
      deleted: true,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log('Successfully marked restaurant as deleted');
    return true;
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    throw error;
  }
};

/**
 * Update restaurant fields (e.g., tags)
 */
export const updateRestaurant = async (restaurantId, updates) => {
  try {
    if (!restaurantId || typeof restaurantId !== 'string') {
      throw new Error(`Invalid restaurant ID: ${restaurantId}. Expected a string.`);
    }
    
    // Clean out undefined values - Firestore doesn't accept undefined
    // But DO accept empty arrays and other falsy values like empty strings
    const cleanedUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined && value !== null)
    );

    console.log('Updating restaurant with:', cleanedUpdates);

    const docRef = doc(db, RESTAURANTS_COLLECTION, restaurantId);
    await updateDoc(docRef, {
      ...cleanedUpdates,
      updatedAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
};

// ==================== REVIEWS ====================

/**
 * Get all reviews for a restaurant
 */
export const getReviewsForRestaurant = async (restaurantId) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('restaurantId', '==', restaurantId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting reviews:', error);
    return [];
  }
};

/**
 * Get user's review for a specific restaurant
 */
export const getUserReviewForRestaurant = async (restaurantId, userId) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('restaurantId', '==', restaurantId),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  } catch (error) {
    console.error('Error getting user review:', error);
    return null;
  }
};

/**
 * Add or update review
 */
export const saveReview = async (restaurantId, userId, reviewData) => {
  try {
    // Check if user already has a review
    const existingReview = await getUserReviewForRestaurant(restaurantId, userId);
    
    if (existingReview) {
      // Update existing review
      const docRef = doc(db, REVIEWS_COLLECTION, existingReview.id);
      await updateDoc(docRef, {
        ...reviewData,
        updatedAt: serverTimestamp()
      });
      return { id: existingReview.id, ...reviewData, userId, restaurantId };
    } else {
      // Create new review
      const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
        restaurantId,
        userId,
        ...reviewData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, restaurantId, userId, ...reviewData };
    }
  } catch (error) {
    console.error('Error saving review:', error);
    throw error;
  }
};
