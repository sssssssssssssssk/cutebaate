import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionCreate from '../components/SessionCreate';
import SessionJoin from '../components/SessionJoin';
import GroupChatCreate from '../components/GroupChatCreate';
import GroupChatJoin from '../components/GroupChatJoin';
import { Session } from '../types';

interface ChatSelectionProps {
  onSessionCreated: (session: Session, isGroup: boolean) => void;
  onSessionJoined: (session: Session, isGroup: boolean) => void;
}

type SelectionMode = 'choice' | 'create' | 'join' | 'create-group' | 'join-group';

const ChatSelection: React.FC<ChatSelectionProps> = ({ onSessionCreated, onSessionJoined }) => {
  const [mode, setMode] = useState<SelectionMode>('choice');
  const navigate = useNavigate();

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full">
          <button
            onClick={() => setMode('choice')}
            className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Options
          </button>
          <SessionCreate onSessionCreated={(session) => onSessionCreated(session, false)} />
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full">
          <button
            onClick={() => setMode('choice')}
            className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Options
          </button>
          <SessionJoin onSessionJoined={(session) => onSessionJoined(session, false)} />
        </div>
      </div>
    );
  }

  if (mode === 'create-group') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full">
          <button
            onClick={() => setMode('choice')}
            className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Options
          </button>
          <GroupChatCreate onSessionCreated={(session) => onSessionCreated(session, true)} />
        </div>
      </div>
    );
  }

  if (mode === 'join-group') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
        <div className="w-full">
          <button
            onClick={() => setMode('choice')}
            className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Options
          </button>
          <GroupChatJoin onSessionJoined={(session) => onSessionJoined(session, true)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors mx-auto"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Choose Chat Type</h1>
          <p className="text-xl text-gray-600">Select how you want to communicate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* One-on-One Chat */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">One-on-One Chat</h2>
              <p className="text-gray-600">Private conversation between two people</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setMode('create')}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-4 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Create New Session
              </button>
              <button
                onClick={() => setMode('join')}
                className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Join Existing Session
              </button>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>✓ Direct peer-to-peer connection</p>
              <p>✓ End-to-end encrypted</p>
              <p>✓ Perfect for private conversations</p>
            </div>
          </div>

          {/* Group Chat */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-purple-200">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Group Chat</h2>
              <p className="text-gray-600">Chat with multiple people</p>
              <span className="inline-block bg-purple-100 text-purple-600 text-xs font-semibold px-3 py-1 rounded-full mt-2">
                NEW FEATURE
              </span>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => setMode('create-group')}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-105 shadow-lg"
              >
                Create Group Chat
              </button>
              <button
                onClick={() => setMode('join-group')}
                className="w-full bg-gray-200 text-gray-800 py-4 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Join Group Chat
              </button>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p>✓ Host controls who can join</p>
              <p>✓ Request-to-join system</p>
              <p>✓ All messages encrypted</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSelection;
