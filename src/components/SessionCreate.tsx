import React from 'react';
import { generateSessionId, generatePassword } from '../utils/sessionUtils';
import { Session } from '../types';

interface SessionCreateProps {
  onSessionCreated: (session: Session) => void;
}

const SessionCreate: React.FC<SessionCreateProps> = ({ onSessionCreated }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [copied, setCopied] = React.useState<{ id: boolean; password: boolean }>({
    id: false,
    password: false
  });

  const createNewSession = () => {
    const newSession: Session = {
      sessionId: generateSessionId(),
      password: generatePassword(),
      userId: `host_${Date.now()}`,
      createdAt: Date.now()
    };
    setSession(newSession);
  };

  const copyToClipboard = (text: string, type: 'id' | 'password') => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => {
      setCopied({ ...copied, [type]: false });
    }, 2000);
  };

  const startSession = () => {
    if (session) {
      onSessionCreated(session);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Create New Session</h2>
          <p className="text-gray-600">Generate a secure, anonymous chat session</p>
        </div>

        {!session ? (
          <button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
          >
            Generate Session
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Session ID</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={session.sessionId}
                  readOnly
                  className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-300 font-mono text-lg"
                />
                <button
                  onClick={() => copyToClipboard(session.sessionId, 'id')}
                  className="bg-purple-500 text-white px-4 py-3 rounded-lg hover:bg-purple-600 transition-colors"
                  title="Copy Session ID"
                >
                  {copied.id ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">Password</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={session.password}
                  readOnly
                  className="flex-1 bg-white px-4 py-3 rounded-lg border border-gray-300 font-mono text-sm"
                />
                <button
                  onClick={() => copyToClipboard(session.password, 'password')}
                  className="bg-pink-500 text-white px-4 py-3 rounded-lg hover:bg-pink-600 transition-colors"
                  title="Copy Password"
                >
                  {copied.password ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Important</h4>
                  <p className="text-sm text-yellow-700">Share these credentials with the person you want to chat with. They will need both to join your session.</p>
                </div>
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Secure Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionCreate;
