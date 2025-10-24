import React from 'react';
import { X, Settings, LogOut, HelpCircle, User } from 'lucide-react';

const SideDrawer = ({ isOpen, onClose, currentUser, onLogout }) => {
  const menuItems = [
    { id: 'profile', label: 'Profile', icon: User, action: 'profile' },
    { id: 'settings', label: 'Settings', icon: Settings, action: 'settings' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, action: 'help' },
    { id: 'logout', label: 'Logout', icon: LogOut, action: 'logout', isDanger: true }
  ];

  const handleMenuClick = (itemId, action) => {
    if (action === 'logout') {
      onLogout();
    }
    // Add other menu handlers here later
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={onClose}
        ></div>
      )}

      {/* Drawer */}
      <div
        className={`fixed left-0 top-0 bottom-0 w-64 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">Fuchu Chuchu</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="p-6 border-b bg-gray-50">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg ${
                currentUser.color === 'bg-red-500' ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                {currentUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{currentUser.name}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id, item.action)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.isDanger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t text-center text-xs text-gray-500">
          <p>Fuchu Chuchu App v1.0</p>
        </div>
      </div>
    </>
  );
};

export default SideDrawer;
