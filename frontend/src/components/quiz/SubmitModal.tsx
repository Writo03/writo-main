import React from 'react';
import { AlertCircle } from 'lucide-react';

interface SubmitModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const SubmitModal = ({ onConfirm, onCancel }: SubmitModalProps) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <AlertCircle className="h-6 w-6 text-indigo-600 mr-2" />
          <h3 className="text-lg font-semibold">Submit Quiz?</h3>
        </div>
        <p className="text-gray-600 mb-6">
          Are you sure you want to submit your answers? You won't be able to change them after submission.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;