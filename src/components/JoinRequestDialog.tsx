import React from 'react';

interface JoinRequest {
  userId: string;
  timestamp: number;
}

interface JoinRequestDialogProps {
  requests: JoinRequest[];
  onApprove: (userId: string) => void;
  onReject: (userId: string) => void;
}

const JoinRequestDialog: React.FC<JoinRequestDialogProps> = ({ requests, onApprove, onReject }) => {
  if (requests.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm w-full space-y-3 animate-slide-up">
      {requests.map((request) => (
        <div
          key={request.userId}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-4 border-2 border-purple-500"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-gray-800 dark:text-white">Join Request</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                User {request.userId.substring(0, 8)}...
              </p>
              <p className="text-xs text-gray-500">
                {new Date(request.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl">👤</span>
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onReject(request.userId)}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors"
            >
              ✕ Reject
            </button>
            <button
              onClick={() => onApprove(request.userId)}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg font-semibold hover:bg-green-600 transition-colors"
            >
              ✓ Approve
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequestDialog;
