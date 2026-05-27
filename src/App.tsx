import { useState } from 'react';
import SessionCreate from './components/SessionCreate';
import SessionJoin from './components/SessionJoin';
import ChatRoom from './components/ChatRoom';
import { Session } from './types';

type AppState = 'landing' | 'create' | 'join' | 'chat';

function App() {
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [isHost, setIsHost] = useState(false);

  const handleCreateSession = (session: Session) => {
    setCurrentSession(session);
    setIsHost(true);
    setAppState('chat');
  };

  const handleJoinSession = (session: Session) => {
    setCurrentSession(session);
    setIsHost(false);
    setAppState('chat');
  };

  const handleExitChat = () => {
    setCurrentSession(null);
    setIsHost(false);
    setAppState('landing');
  };

  const renderContent = () => {
    switch (appState) {
      case 'landing':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
              {/* Hero Section */}
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-2xl">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                </div>
                <h1 className="text-5xl font-bold text-gray-800 mb-4">
                  SecureChat
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                  Anonymous, End-to-End Encrypted Messaging
                </p>
                
                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">End-to-End Encrypted</h3>
                    <p className="text-sm text-gray-600">Your messages are encrypted and only you and your chat partner can read them</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">No Data Stored</h3>
                    <p className="text-sm text-gray-600">Zero logs, zero tracking. Messages exist only during your session</p>
                  </div>
                  
                  <div className="bg-white rounded-xl p-6 shadow-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-2">Truly Anonymous</h3>
                    <p className="text-sm text-gray-600">No registration, no phone number, no email required</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setAppState('create')}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Create New Session</h2>
                  <p className="text-gray-600">Start a new anonymous chat and share the credentials with someone</p>
                </button>

                <button
                  onClick={() => setAppState('join')}
                  className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 text-left group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <svg className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Join Existing Session</h2>
                  <p className="text-gray-600">Enter session credentials to connect to an existing chat</p>
                </button>
              </div>

              {/* Footer Info */}
              <div className="mt-12 text-center">
                <div className="bg-white rounded-xl p-6 shadow-lg inline-block">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Privacy First:</span> All communications are peer-to-peer. 
                    No server can access your messages. When you end the session, everything is permanently deleted.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'create':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
            <div className="w-full">
              <button
                onClick={() => setAppState('landing')}
                className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors mx-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
              <SessionCreate onSessionCreated={handleCreateSession} />
            </div>
          </div>
        );

      case 'join':
        return (
          <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex items-center justify-center p-4">
            <div className="w-full">
              <button
                onClick={() => setAppState('landing')}
                className="mb-6 flex items-center text-gray-700 hover:text-gray-900 transition-colors mx-auto"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Home
              </button>
              <SessionJoin onSessionJoined={handleJoinSession} />
            </div>
          </div>
        );

      case 'chat':
        return currentSession ? (
          <ChatRoom
            session={currentSession}
            isHost={isHost}
            onExit={handleExitChat}
          />
        ) : null;

      default:
        return null;
    }
  };

  return <>{renderContent()}</>;
}

export default App;
