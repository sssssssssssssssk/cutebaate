import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';

interface AboutProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const About: React.FC<AboutProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <InteractiveBackground />
      <Navbar />
      
      <div className="flex-1 py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mx-auto mb-6 flex items-center justify-center shadow-xl shadow-purple-500/20 transform hover:rotate-12 transition-transform duration-300">
              <span className="text-5xl">🔒</span>
            </div>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">About SecureChat</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto font-medium">
              We believe privacy is a fundamental right — not a premium feature. SecureChat was built to prove that truly private communication can exist.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300 hover:-translate-y-0.5">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Our Mission</h2>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed mb-4">
              In an age where every message is tracked, stored, and analyzed, we created a space where your conversations remain truly yours. SecureChat uses military-grade AES-256 encryption and peer-to-peer WebRTC connections — meaning your messages never touch our servers because <strong>we have no servers to store them on</strong>.
            </p>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
              When you end a session, everything is permanently destroyed. No logs, no metadata, no traces. That's not a marketing promise — it's the architecture.
            </p>
          </div>

          {/* How It Works */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">How It Works</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { step: '1', icon: '🎲', title: 'Create Session', desc: 'Generate a random Session ID and password. No account needed.' },
                { step: '2', icon: '🔗', title: 'Share the Link', desc: 'Send the invite link to your chat partner via any channel.' },
                { step: '3', icon: '🤝', title: 'Connect P2P', desc: 'Direct WebRTC connection. No middleman can intercept.' },
                { step: '4', icon: '💣', title: 'Exit = Delete', desc: 'End session to permanently destroy all messages forever.' },
              ].map(s => (
                <div key={s.step} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mx-auto mb-3 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-3xl">{s.icon}</span>
                  </div>
                  <div className="text-xs font-extrabold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Step {s.step}</div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Security Technology */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">Security Technology</h2>
            <div className="space-y-5">
              {[
                { icon: '🛡️', title: 'AES-256 Encryption', desc: 'The same encryption standard used by governments and banks worldwide. Mathematically impossible to crack with current technology.' },
                { icon: '⚡', title: 'Peer-to-Peer WebRTC', desc: 'Messages travel directly between devices through encrypted WebRTC data channels. No relay server ever sees your data.' },
                { icon: '🗑️', title: 'Zero Storage Architecture', desc: 'We literally cannot read your messages — they never exist on any server. All data lives in browser memory and is destroyed on exit.' },
                { icon: '🎭', title: 'Complete Anonymity', desc: 'No registration. No email. No phone number. Each user gets a random ID that\'s destroyed with the session.' },
                { icon: '🔥', title: 'Self-Destructing Messages', desc: 'Set messages to auto-delete after 5 seconds to 5 minutes. Once gone, they\'re gone from both devices permanently.' },
              ].map((item, i) => (
                <div key={i} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-purple-500/5 dark:hover:bg-purple-400/5 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { num: '256-bit', label: 'Encryption' },
              { num: '0', label: 'Data Stored' },
              { num: 'P2P', label: 'Connection' },
              { num: '100%', label: 'Anonymous' },
            ].map((s, i) => (
              <div key={i} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl p-5 shadow-lg text-center hover:scale-[1.03] transition-transform">
                <p className="text-3xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">{s.num}</p>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-8 mb-8 hover:shadow-2xl transition-all duration-300">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: '🔐', title: 'Privacy First', desc: 'Every feature is designed with privacy as the #1 requirement. We\'d rather not build a feature than compromise privacy.' },
                { icon: '🌍', title: 'Open & Transparent', desc: 'We\'re upfront about what we collect (nothing), how our encryption works, and where your data goes (nowhere).' },
                { icon: '🤝', title: 'For Everyone', desc: 'Available in 8 languages with a free tier that includes every messaging feature. Premium only adds convenience, not security.' },
              ].map((v, i) => (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                    <span className="text-3xl">{v.icon}</span>
                  </div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-xl p-8 text-center text-white transform hover:scale-[1.01] transition-transform shadow-purple-500/20">
            <h2 className="text-3xl font-extrabold mb-3">Ready to Chat Privately?</h2>
            <p className="text-lg mb-6 opacity-90 font-medium">No signup. No downloads. Just encrypted conversation.</p>
            <Link
              to="/chat-selection"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-xl font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-lg active:scale-95"
            >
              Start Chatting Now →
            </Link>
          </div>
        </div>
      </div>

      <Footer onTermsClick={onTermsClick} onPrivacyClick={onPrivacyClick} onReportClick={onReportClick} />
    </div>
  );
};

export default About;
