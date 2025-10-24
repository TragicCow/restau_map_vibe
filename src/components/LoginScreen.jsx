import React, { useState } from 'react';
import { LogIn } from 'lucide-react';
import { signInWithGoogle } from '../firebase/auth';

export default function LoginScreen({ onLoginSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const user = await signInWithGoogle();
      if (user) {
        onLoginSuccess(user);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to sign in. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            RestauVibe
          </h1>
          <p className="text-gray-600">Find your favorite restaurants</p>
        </div>

        <button
          onClick={handleGoogleSignIn}
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogIn size={20} />
          {isLoading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 rounded-lg">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        <p className="text-center text-gray-500 text-xs mt-6">
          Only authorized users can access this application.
        </p>
      </div>
    </div>
  );
}
