import React from 'react';
import { User } from 'lucide-react';

const USERS = [
  { id: 'user1', name: 'Luka', color: '#EF4444', bgColor: 'bg-red-500' },
  { id: 'user2', name: 'Mariam', color: '#3B82F6', bgColor: 'bg-blue-500' }
];

const UserSelector = ({ onSelectUser }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Restaurant Map Vibe
          </h1>
          <p className="text-gray-600">Choose your profile to continue</p>
        </div>
        
        <div className="space-y-4">
          {USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="w-full flex items-center gap-4 p-6 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:shadow-lg transition-all duration-200 group"
            >
              <div 
                className={`${user.bgColor} p-4 rounded-full group-hover:scale-110 transition-transform`}
              >
                <User size={32} className="text-white" />
              </div>
              <div className="text-left flex-1">
                <h2 className="text-2xl font-bold text-gray-800">{user.name}</h2>
                <p className="text-sm text-gray-500">Click to select</p>
              </div>
              <div 
                className="w-6 h-6 rounded-full"
                style={{ backgroundColor: user.color }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserSelector;
export { USERS };
