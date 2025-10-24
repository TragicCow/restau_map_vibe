import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

const toastIcons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const toastColors = {
  success: 'bg-green-100 border-green-300 text-green-800',
  error: 'bg-red-100 border-red-300 text-red-800',
  warning: 'bg-yellow-100 border-yellow-300 text-yellow-800',
  info: 'bg-blue-100 border-blue-300 text-blue-800',
};

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = toastIcons[type] || toastIcons.info;

  return (
    <div
      className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm border rounded-lg p-4 flex items-start gap-3 shadow-lg z-50 animate-slide-up ${
        toastColors[type]
      }`}
    >
      <Icon size={20} className="flex-shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="text-current opacity-70 hover:opacity-100 transition-opacity"
      >
        <X size={18} />
      </button>
    </div>
  );
}
