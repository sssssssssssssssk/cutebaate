import React, { useState } from 'react';
import { isValidSessionId, isValidPassword, generateUserId } from '../utils/sessionUtils';
import { Session } from '../types';

interface GroupChatJoinProps {
  onSessionJoined: (session: Session) => void;
}

const GroupChatJoin: React.FC<GroupChatJoinProps> = ({ onSessionJoined }) => {
  const [sessionId, setSessionId] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ sessionId?: string; password?: string }>({});

  const formatSessionId = (value: string) => {
    const cleaned = value.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    let formatted = '';
    for (let i = 0; i < cleaned.length && i < 12; i++) {
      if (i > 0 && i % 4 === 0) formatted += '-';
      formatted += cleaned[i];
    }
    return formatted;
  };

  const handleSessionIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatSessionId(e.target.value);
    setSessionId(formatted);
    if (errors.sessionId) {
      setErrors({ ...errors, sessionId: undefined });
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors({ ...errors, password: undefined });
    }
  };

  const handleJoinSession = () => {
    const newErrors: { sessionId?: string; password?: string } = {};

    if (!sessionId) {
      newErrors.sessionId = 'Session ID is required';
    } else if (!isValidSessionId(sessionId)) {
      newErrors.sessionId = 'Invalid session ID format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const session: Session = {
      sessionId,
      password,
      userId: generateUserId(),
      createdAt: Date.now()
    };

    onSessionJoined(session);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoinSession();
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Join Group Chat</h2>
          <p className="text-gray-600">Enter credentials to request access</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Group Session ID
            </label>
            <input
              type="text"
              value={sessionId}
              onChange={handleSessionIdChange}
              onKeyPress={handleKeyPress}
              placeholder="XXXX-XXXX-XXXX"
              maxLength={14}
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.sessionId ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:outline-none font-mono text-lg transition-colors`}
            />
            {errors.sessionId && (
              <p className="text-red-500 text-sm mt-1">{errors.sessionId}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={handlePasswordChange}
              onKeyPress={handleKeyPress}
              placeholder="Enter group password"
              className={`w-full px-4 py-3 rounded-xl border-2 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              } focus:border-blue-500 focus:outline-none transition-colors`}
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
            <div className="flex items-start space-x-3">
              <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Waiting for Approval</h4>
                <p className="text-sm text-yellow-700">
                  After joining, you'll need to wait for the host to approve your join request before you can participate.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleJoinSession}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Request to Join Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupChatJoin;
