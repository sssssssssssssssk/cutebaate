import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';

interface HomeProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const Home: React.FC<HomeProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <InteractiveBackground />
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 z-10">
        <div className="max-w-4xl w-full">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-500/20 transform hover:rotate-12 transition-transform duration-300">
                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
            <h1 className="text-6xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
              <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">SecureChat</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 font-medium">
              Anonymous, End-to-End Encrypted Messaging
            </p>
            
            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">End-to-End Encrypted</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Your messages are encrypted and only you and your chat partner can read them</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">No Data Stored</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">Zero logs, zero tracking. Messages exist only in memory during your active session</p>
              </div>
              
              <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">Truly Anonymous</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">No registration, no phone number, no email required. Instantly join and chat</p>
              </div>
            </div>

            {/* Interactive Feature Highlights */}
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg border border-gray-100 dark:border-gray-700/30 rounded-3xl p-8 shadow-xl mb-12 text-left">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
                ✨ Powered by Next-Gen Interactive Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="flex items-start space-x-3 bg-white/40 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/20">
                  <span className="text-xl">📞</span>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Free P2P Voice & Video Calls</h4>
                    <p className="text-gray-600 dark:text-gray-400">Crystal-clear WebRTC audio & video calling direct between browsers, with no intermediate servers.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/40 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/20">
                  <span className="text-xl">📸</span>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Screenshot Alerts</h4>
                    <p className="text-gray-600 dark:text-gray-400">Get instantly notified if the other user takes a screenshot of the conversation.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/40 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/20">
                  <span className="text-xl">🗳️</span>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Anonymous Group Polls</h4>
                    <p className="text-gray-600 dark:text-gray-400">Create interactive, decentralized, real-time polls to vote on group decisions anonymously.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/40 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/20">
                  <span className="text-xl">🛡️</span>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Multi-Admin & Moderator Roles</h4>
                    <p className="text-gray-600 dark:text-gray-400">Define precise roles (Admin, Moderator, Member) to mute, kick, ban, or control file sharing permissions.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/40 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/20">
                  <span className="text-xl">↩️</span>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">Swipe to Reply & Emojis</h4>
                    <p className="text-gray-600 dark:text-gray-400">Slide messages right with haptics to quote-reply, and double-tap to react instantly with love hearts.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3 bg-white/40 dark:bg-gray-900/20 p-4 rounded-xl border border-gray-100/50 dark:border-gray-700/20">
                  <span className="text-xl">🗑️</span>
                  <div>
                    <h4 className="font-bold text-gray-800 dark:text-white">WhatsApp Message Deletion</h4>
                    <p className="text-gray-600 dark:text-gray-400">"Delete for Everyone" or "Delete for Me" with native warning markers to fully control your footprint.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/chat-selection"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 text-left group block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-purple-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 dark:group-hover:text-purple-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Start Chatting</h2>
              <p className="text-gray-600 dark:text-gray-300">Begin a secure encrypted conversation now</p>
            </Link>

            <Link
              to="/blog"
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 text-left group block"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/20">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <svg className="w-6 h-6 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Learn & Help</h2>
              <p className="text-gray-600 dark:text-gray-300">Read guides and learn about secure messaging</p>
            </Link>
          </div>

          {/* Footer Info */}
          <div className="mt-12 text-center">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl p-6 shadow-lg inline-block max-w-2xl">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-semibold text-purple-600 dark:text-purple-400">Privacy First:</span> All communications are peer-to-peer. 
                No server can access your messages. When you end the session, everything is permanently deleted.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer 
        onTermsClick={onTermsClick}
        onPrivacyClick={onPrivacyClick}
        onReportClick={onReportClick}
      />
    </div>
  );
};

export default Home;
