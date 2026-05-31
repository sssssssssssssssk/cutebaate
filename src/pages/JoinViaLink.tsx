import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Session } from '../types';
import { generateUserId } from '../utils/sessionUtils';
import Navbar from '../components/Navbar';

interface JoinViaLinkProps {
  onSessionJoined: (session: Session, isGroup: boolean) => void;
}

const JoinViaLink: React.FC<JoinViaLinkProps> = ({ onSessionJoined }) => {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const [parsed, setParsed] = useState<{ sessionId: string; password: string; isGroup?: boolean } | null>(null);
  const [error, setError] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    if (!code) {
      setError('Invalid invite link — no code found.');
      return;
    }

    try {
      const decoded = atob(code);
      const data = JSON.parse(decoded);

      if (!data.sessionId || !data.password) {
        setError('Invalid invite link — missing credentials.');
        return;
      }

      if (data.expiresAt && Date.now() > data.expiresAt) {
        setError('This invite link has expired. Please request a new invite link.');
        return;
      }

      setParsed(data);
    } catch {
      setError('Invalid or corrupted invite link.');
    }
  }, [code]);

  const handleJoin = () => {
    if (!parsed) return;

    setJoining(true);

    const session: Session = {
      sessionId: parsed.sessionId,
      password: parsed.password,
      userId: generateUserId(),
      createdAt: Date.now()
    };

    onSessionJoined(session, !!parsed.isGroup);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">🔗</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                You've Been Invited!
              </h2>
              <p className="text-gray-600 dark:text-gray-300">
                Someone shared a secure chat session with you.
              </p>
            </div>

            {/* Error State */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                <div className="flex items-start space-x-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <h4 className="font-semibold text-red-800 dark:text-red-300 mb-1">Invalid Link</h4>
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Parsed Credentials */}
            {parsed && !error && (
              <div className="space-y-4">
                {/* Session Info Card */}
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-gray-700 dark:to-gray-700 rounded-xl p-4 border border-purple-200 dark:border-gray-600">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-lg">🔒</span>
                    <span className="font-semibold text-gray-800 dark:text-white">Session Details</span>
                    {parsed.isGroup && (
                      <span className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        GROUP
                      </span>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Session ID</p>
                      <p className="font-mono text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                        {parsed.sessionId}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">Password</p>
                      <p className="font-mono text-sm text-gray-800 dark:text-white bg-white dark:bg-gray-800 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600">
                        {'•'.repeat(parsed.password.length)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Privacy Notice */}
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-lg">🛡️</span>
                    <div className="text-sm text-green-800 dark:text-green-300">
                      <p className="font-semibold mb-1">End-to-End Encrypted</p>
                      <p className="text-xs opacity-80">
                        Your conversation will be fully encrypted. No data is stored on any server.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-60 disabled:transform-none"
                >
                  {joining ? (
                    <span className="flex items-center justify-center space-x-2">
                      <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Joining...</span>
                    </span>
                  ) : (
                    `Join ${parsed.isGroup ? 'Group ' : ''}Chat`
                  )}
                </button>
              </div>
            )}

            {/* Back to Home */}
            <button
              onClick={() => navigate('/')}
              className="w-full mt-4 text-gray-500 dark:text-gray-400 text-sm hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinViaLink;
