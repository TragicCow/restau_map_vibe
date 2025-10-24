import React from 'react';
import { Menu } from 'lucide-react';

const Header = ({ title, onMenuClick, currentUser }) => {
  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="flex items-center justify-between p-4 max-w-md mx-auto">
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-full transition"
        >
          <Menu className="w-6 h-6 text-gray-700" />
        </button>
        
        <h1 className="text-lg font-bold text-gray-800">{title}</h1>
        
        {currentUser && (
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            currentUser.color === 'bg-red-500' ? 'bg-red-500' : 'bg-blue-500'
          }`}>
            {currentUser.name?.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
