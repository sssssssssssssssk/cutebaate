import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SessionCreate from '../components/SessionCreate';
import SessionJoin from '../components/SessionJoin';
import GroupChatCreate from '../components/GroupChatCreate';
import GroupChatJoin from '../components/GroupChatJoin';
import InteractiveBackground from '../components/InteractiveBackground';
import { Session } from '../types';

interface ChatSelectionProps {
  onSessionCreated: (session: Session, isGroup: boolean) => void;
  onSessionJoined: (session: Session, isGroup: boolean) => void;
}

type SelectionMode = 'choice' | 'create' | 'join' | 'create-group' | 'join-group';

const ChatSelection: React.FC<ChatSelectionProps> = ({ onSessionCreated, onSessionJoined }) => {
  const [mode, setMode] = useState<SelectionMode>('choice');
  const navigate = useNavigate();

  const handleBackToChoice = () => setMode('choice');

  const containerClass = "min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden";

  const backButton = (
    <button
      onClick={handleBackToChoice}
      className="mb-8 flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-150/40 dark:border-gray-800/40 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer mx-auto font-semibold"
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
      Back to Options
    </button>
  );

  if (mode === 'create') {
    return (
      <div className={containerClass}>
        <InteractiveBackground />
        <div className="w-full max-w-lg z-10">
          {backButton}
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 rounded-3xl p-2 shadow-2xl">
            <SessionCreate onSessionCreated={(session) => onSessionCreated(session, false)} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join') {
    return (
      <div className={containerClass}>
        <InteractiveBackground />
        <div className="w-full max-w-lg z-10">
          {backButton}
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 rounded-3xl p-2 shadow-2xl">
            <SessionJoin onSessionJoined={(session) => onSessionJoined(session, false)} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create-group') {
    return (
      <div className={containerClass}>
        <InteractiveBackground />
        <div className="w-full max-w-lg z-10">
          {backButton}
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 rounded-3xl p-2 shadow-2xl">
            <GroupChatCreate onSessionCreated={(session) => onSessionCreated(session, true)} />
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'join-group') {
    return (
      <div className={containerClass}>
        <InteractiveBackground />
        <div className="w-full max-w-lg z-10">
          {backButton}
          <div className="bg-white/40 dark:bg-gray-900/40 backdrop-blur-xl border border-white/20 dark:border-gray-800/40 rounded-3xl p-2 shadow-2xl">
            <GroupChatJoin onSessionJoined={(session) => onSessionJoined(session, true)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden justify-center items-center py-12 px-4">
      <InteractiveBackground />
      
      <div className="max-w-4xl w-full z-10 flex flex-col justify-center">
        <button
          onClick={() => navigate('/')}
          className="mb-8 flex items-center text-gray-700 dark:text-gray-300 hover:text-purple-650 dark:hover:text-purple-400 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md px-5 py-2.5 rounded-full border border-gray-150/40 dark:border-gray-800/40 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-pointer mx-auto font-semibold"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        <div className="text-center mb-10">
          <span className="inline-flex items-center space-x-1 bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400 border border-purple-100/20 dark:border-purple-900/20 px-4 py-1.5 rounded-full text-xs font-bold mb-4 tracking-wider uppercase">
            ✨ Secure Chat Options
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
            <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Choose Chat Type</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">Select how you want to communicate</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto w-full">
          {/* One-on-One Chat */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-100/40 dark:border-gray-800/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-purple-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/20 transform hover:rotate-6 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">One-on-One Chat</h2>
              <p className="text-sm text-gray-650 dark:text-gray-355 mb-6">Private end-to-end encrypted conversation between two people</p>
            </div>

            <div>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setMode('create')}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 rounded-xl font-bold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] active:scale-98 shadow-md shadow-purple-500/10 cursor-pointer"
                >
                  Create New Session
                </button>
                <button
                  onClick={() => setMode('join')}
                  className="w-full bg-purple-500/5 hover:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/30 py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  Join Existing Session
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 border-t border-gray-150/40 dark:border-gray-800/40 pt-4">
                <p className="flex items-center">
                  <span className="text-purple-500 mr-2">✓</span> Direct peer-to-peer connection
                </p>
                <p className="flex items-center">
                  <span className="text-purple-500 mr-2">✓</span> Zero traces, fully anonymous
                </p>
                <p className="flex items-center">
                  <span className="text-purple-500 mr-2">✓</span> Screen share & media transfers
                </p>
              </div>
            </div>
          </div>

          {/* Group Chat */}
          <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border border-gray-100/40 dark:border-gray-800/40 rounded-3xl p-8 shadow-xl hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between">
            <div className="text-center relative">
              <div className="absolute top-0 right-0">
                <span className="bg-blue-500/10 dark:bg-blue-400/10 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2.5 py-1 rounded-full border border-blue-100/20 dark:border-blue-900/20 tracking-wide uppercase shadow-sm">
                  NEW
                </span>
              </div>
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/20 transform hover:rotate-6 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2">Group Chat</h2>
              <p className="text-sm text-gray-650 dark:text-gray-355 mb-6">Create or join decentralised group sessions with admin controls</p>
            </div>

            <div>
              <div className="space-y-3 mb-6">
                <button
                  onClick={() => setMode('create-group')}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3.5 rounded-xl font-bold hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] active:scale-98 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  Create Group Chat
                </button>
                <button
                  onClick={() => setMode('join-group')}
                  className="w-full bg-blue-500/5 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30 py-3.5 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  Join Group Chat
                </button>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400 space-y-2 border-t border-gray-150/40 dark:border-gray-800/40 pt-4">
                <p className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span> Multi-admin roles & muted control
                </p>
                <p className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span> Interactive anonymous group polls
                </p>
                <p className="flex items-center">
                  <span className="text-blue-500 mr-2">✓</span> Easy links with custom expiries
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatSelection;

