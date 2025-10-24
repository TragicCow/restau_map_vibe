import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, collection, getDocs, query, where } from 'firebase/firestore';
import app, { db } from './config';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Check if email is authorized by querying Firestore
 * @param {string} email - User's email address
 * @returns {Promise<boolean>} - True if email is authorized
 */
export const isEmailAuthorized = async (email) => {
  try {
    // Query authorized_users collection for this email
    const q = query(
      collection(db, 'authorized_users'),
      where('email', '==', email.toLowerCase()),
      where('active', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.size > 0;
  } catch (error) {
    console.error('Error checking email authorization:', error);
    return false;
  }
};

/**
 * Sign in with Google
 * @returns {Promise<object>} - User object
 */
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Check if email is authorized in Firestore
    const authorized = await isEmailAuthorized(user.email);
    if (!authorized) {
      // Sign out if not authorized
      await signOut(auth);
      throw new Error(`Access denied. ${user.email} is not authorized to use Fuchu Chuchu App.`);
    }
    
    return {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw error;
  }
};

/**
 * Sign out current user
 */
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
};

/**
 * Get current authenticated user
 * @returns {Promise<object|null>} - User object or null
 */
export const getCurrentUser = async () => {
  return new Promise(async (resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is still authorized in Firestore
        const authorized = await isEmailAuthorized(user.email);
        if (authorized) {
          resolve({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
          });
        } else {
          // User was removed from authorized list
          await signOut(auth);
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  });
};

/**
 * Listen to auth state changes
 * @param {function} callback - Function to call when auth state changes
 */
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // Check if user is still authorized in Firestore
      const authorized = await isEmailAuthorized(user.email);
      if (authorized) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        // User no longer authorized
        callback(null);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * Get list of authorized emails from Firestore
 * @returns {Promise<array>} - Array of authorized email objects
 */
export const getAuthorizedEmails = async () => {
  try {
    const q = query(
      collection(db, 'authorized_users'),
      where('active', '==', true)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching authorized emails:', error);
    return [];
  }
};

export { auth };
export default auth;
