import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

/**
 * Add a new restaurant to Firestore
 * @param {Object} restaurantData - Restaurant data object
 * @returns {Promise<string>} - Document ID
 */
export async function addRestaurant(restaurantData) {
  try {
    // Filter out undefined values to prevent Firestore errors
    const filteredData = Object.entries(restaurantData)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const docRef = await addDoc(collection(db, 'restaurants'), {
      ...filteredData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding restaurant:', error);
    throw error;
  }
}

/**
 * Update restaurant fields
 * @param {string} restaurantId - Restaurant document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updateRestaurant(restaurantId, updates) {
  try {
    // Filter out undefined/null values but keep empty arrays
    const filteredUpdates = Object.entries(updates)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    console.log('Updating restaurant with:', filteredUpdates);

    const docRef = doc(db, 'restaurants', restaurantId);
    await updateDoc(docRef, {
      ...filteredUpdates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating restaurant:', error);
    throw error;
  }
}

/**
 * Get all restaurants for a user
 * @param {string} userId - User ID
 * @returns {Promise<Array>} - Array of restaurant documents
 */
export async function getRestaurants(userId) {
  try {
    const q = query(
      collection(db, 'restaurants'),
      where('addedBy', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting restaurants:', error);
    throw error;
  }
}

/**
 * Soft delete a restaurant (mark as deleted)
 * @param {string} restaurantId - Restaurant document ID
 * @returns {Promise<void>}
 */
export async function deleteRestaurant(restaurantId) {
  try {
    const docRef = doc(db, 'restaurants', restaurantId);
    await updateDoc(docRef, {
      deleted: true,
      deletedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error deleting restaurant:', error);
    throw error;
  }
}

/**
 * Add or update a review for a restaurant
 * @param {Object} reviewData - Review data object
 * @returns {Promise<void>}
 */
export async function addReview(reviewData) {
  try {
    const filteredData = Object.entries(reviewData)
      .filter(([_, value]) => value !== undefined)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const docRef = await addDoc(collection(db, 'reviews'), {
      ...filteredData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
}

/**
 * Get reviews for a restaurant
 * @param {string} restaurantId - Restaurant document ID
 * @returns {Promise<Array>} - Array of review documents
 */
export async function getReviews(restaurantId) {
  try {
    const q = query(
      collection(db, 'reviews'),
      where('restaurantId', '==', restaurantId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
}

/**
 * Update a review
 * @param {string} reviewId - Review document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<void>}
 */
export async function updateReview(reviewId, updates) {
  try {
    const filteredUpdates = Object.entries(updates)
      .filter(([_, value]) => value !== undefined && value !== null)
      .reduce((obj, [key, value]) => {
        obj[key] = value;
        return obj;
      }, {});

    const docRef = doc(db, 'reviews', reviewId);
    await updateDoc(docRef, {
      ...filteredUpdates,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}
