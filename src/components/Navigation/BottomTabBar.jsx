import React from 'react';
import { MapPin, MessageCircle, FileText, Gamepad2 } from 'lucide-react';

const BottomTabBar = ({ activeTab, onTabChange, unreadChat = 0, unreadNotes = 0 }) => {
  const tabs = [
    { id: 'map', label: 'Map', icon: MapPin },
    { id: 'chat', label: 'Chat', icon: MessageCircle, badge: unreadChat },
    { id: 'notes', label: 'Notes', icon: FileText, badge: unreadNotes },
    { id: 'games', label: 'Games', icon: Gamepad2 }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center w-full h-full relative transition-colors ${
                isActive
                  ? 'text-primary'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={24} />
              <span className={`text-xs font-medium mt-1 ${
                isActive ? 'text-primary' : 'text-gray-500'
              }`}>
                {tab.label}
              </span>
              
              {/* Badge for unread messages */}
              {tab.badge > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary"></div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomTabBar;
