import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { firebaseConfig } from './config';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({ prompt: 'select_account' });

/**
 * Check if email is authorized in Firestore authorized_users collection
 * @param {string} email - User email to check
 * @returns {Promise<boolean>} - Whether email is authorized
 */
export async function isEmailAuthorized(email) {
  try {
    const authorizedUsersRef = collection(db, 'authorized_users');
    const q = query(
      authorizedUsersRef,
      where('email', '==', email.toLowerCase())
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('Error checking email authorization:', error);
    return false;
  }
}

/**
 * Sign in user with Google and verify authorization
 * @returns {Promise<User|null>} - Authenticated user or null
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if email is authorized
    const authorized = await isEmailAuthorized(user.email);
    if (!authorized) {
      await signOut(auth);
      throw new Error(`Email ${user.email} is not authorized to access this application.`);
    }

    return user;
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

/**
 * Sign out current user
 * @returns {Promise<void>}
 */
export async function signOutUser() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

/**
 * Get current authenticated user
 * @returns {User|null} - Current user or null
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Listen to auth state changes and verify user authorization
 * @param {Function} callback - Function to call with (user|null)
 * @returns {Function} - Unsubscribe function
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Verify user is still authorized
      const authorized = await isEmailAuthorized(user.email);
      if (authorized) {
        callback(user);
      } else {
        // User no longer authorized
        await signOut(auth);
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}
