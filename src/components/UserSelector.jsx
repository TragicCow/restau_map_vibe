import { Users } from 'lucide-react';

export const USERS = [
  { id: 1, name: 'Luka', color: 'bg-red-500', initial: 'L' },
  { id: 2, name: 'Mariam', color: 'bg-blue-500', initial: 'M' },
];

// Map email addresses to app users
const EMAIL_TO_USER = {
  'luka.email@gmail.com': 'Luka',
  'mariam.email@gmail.com': 'Mariam',
};

/**
 * Get user by email address
 * @param {string} email - User's email address
 * @returns {Object|null} - User object or null if not found
 */
export function getUserByEmail(email) {
  if (!email) return null;

  const userName = EMAIL_TO_USER[email.toLowerCase()];
  return USERS.find((u) => u.name === userName) || null;
}

export default function UserSelector({ onUserSelect }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Users size={48} className="mx-auto text-purple-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">Welcome!</h1>
          <p className="text-gray-600 mt-2">Choose your account</p>
        </div>

        <div className="space-y-3">
          {USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => onUserSelect(user)}
              className={`w-full p-4 rounded-lg font-semibold text-white transition-all transform hover:scale-105 active:scale-95 ${user.color}`}
            >
              {user.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
