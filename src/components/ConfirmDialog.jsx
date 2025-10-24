import React from 'react';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onCancel}
      />

      {/* Dialog - Bottom sheet on mobile, centered on desktop */}
      <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-1/2 md:left-1/2 md:transform md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-sm bg-white rounded-t-lg md:rounded-lg shadow-xl z-50 p-6 md:p-8 animate-slide-up md:animate-none">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="text-warning mt-1 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">{title}</h2>
            <p className="text-gray-600 text-sm mt-1">{message}</p>
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 font-medium bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 font-medium rounded-lg transition-colors ${
              isDangerous
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </>
  );
}
