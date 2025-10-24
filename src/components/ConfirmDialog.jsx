import React from 'react';
import { X, AlertCircle } from 'lucide-react';

const ConfirmDialog = ({ title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', isDangerous = false }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[70] flex items-end sm:items-center justify-center p-4 pb-0 sm:p-4">
      <div className="bg-white w-full max-w-sm rounded-t-2xl sm:rounded-2xl shadow-2xl p-6 space-y-4 animate-slideUp">
        <div className="flex items-start gap-3">
          {isDangerous && (
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            <p className="text-sm text-gray-600 mt-1">{message}</p>
          </div>
          <button
            onClick={onCancel}
            className="p-1 hover:bg-gray-100 rounded transition"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition text-sm"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition text-sm text-white ${
              isDangerous
                ? 'bg-red-500 hover:bg-red-600'
                : 'bg-primary hover:bg-indigo-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
