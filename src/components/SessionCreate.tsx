import React from 'react';
import { generateSessionId, generatePassword } from '../utils/sessionUtils';
import { Session } from '../types';

interface SessionCreateProps {
  onSessionCreated: (session: Session) => void;
}

const SessionCreate: React.FC<SessionCreateProps> = ({ onSessionCreated }) => {
  const [session, setSession] = React.useState<Session | null>(null);
  const [copied, setCopied] = React.useState<{ id: boolean; password: boolean; link: boolean }>({
    id: false,
    password: false,
    link: false
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

  const copyToClipboard = (text: string, type: 'id' | 'password' | 'link') => {
    navigator.clipboard.writeText(text);
    setCopied({ ...copied, [type]: true });
    setTimeout(() => {
      setCopied({ ...copied, [type]: false });
    }, 2000);
  };

  const getInviteLink = (): string => {
    if (!session) return '';
    const payload = btoa(JSON.stringify({
      sessionId: session.sessionId,
      password: session.password,
      isGroup: false
    }));
    return `${window.location.origin}/join/${payload}`;
  };

  const shareVia = (platform: string) => {
    const link = getInviteLink();
    const text = '🔒 Join my secure chat on SecureChat!';
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent('SecureChat Invite')}&body=${encodeURIComponent(text + '\n\n' + link)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`
    };
    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const startSession = () => {
    if (session) {
      onSessionCreated(session);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 transition-colors">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">Create New Session</h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400">Generate a secure, anonymous chat session</p>
        </div>

        {!session ? (
          <button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3.5 sm:py-4 rounded-xl font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer"
          >
            Generate Session
          </button>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Session ID */}
            <div className="bg-gray-50 dark:bg-zinc-800/40 rounded-xl p-3.5 sm:p-4 border-2 border-gray-200 dark:border-zinc-700/80">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1.5 block">Session ID</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={session.sessionId}
                  readOnly
                  className="flex-1 min-w-0 bg-white dark:bg-zinc-950 dark:text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-zinc-700 font-mono text-sm sm:text-base focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(session.sessionId, 'id')}
                  className="bg-purple-500 text-white p-2.5 sm:p-3 rounded-lg hover:bg-purple-600 active:scale-90 transition-all flex-shrink-0 cursor-pointer"
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

            {/* Password */}
            <div className="bg-gray-50 dark:bg-zinc-800/40 rounded-xl p-3.5 sm:p-4 border-2 border-gray-200 dark:border-zinc-700/80">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1.5 block">Password</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={session.password}
                  readOnly
                  className="flex-1 min-w-0 bg-white dark:bg-zinc-950 dark:text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-zinc-700 font-mono text-xs sm:text-sm focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(session.password, 'password')}
                  className="bg-pink-500 text-white p-2.5 sm:p-3 rounded-lg hover:bg-pink-600 active:scale-90 transition-all flex-shrink-0 cursor-pointer"
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

            {/* Invite Link Section */}
            <div className="bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl p-3.5 sm:p-4 border-2 border-purple-200 dark:border-purple-900/50">
              <label className="text-xs sm:text-sm font-semibold text-purple-800 dark:text-purple-300 mb-1.5 block flex items-center space-x-2">
                <span>🔗</span>
                <span>Invite Link — Share with One Click!</span>
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={getInviteLink()}
                  readOnly
                  className="flex-1 min-w-0 bg-white dark:bg-zinc-950 dark:text-white px-3 py-2 rounded-lg border border-purple-300 dark:border-purple-800 font-mono text-[10px] text-gray-700 dark:text-zinc-300 truncate focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(getInviteLink(), 'link')}
                  className="bg-purple-500 text-white px-3.5 py-2 rounded-lg hover:bg-purple-600 transition-colors text-xs sm:text-sm font-semibold flex-shrink-0 cursor-pointer"
                >
                  {copied.link ? '✓ Copied' : 'Copy'}
                </button>
              </div>

              {/* Share Buttons */}
              <p className="text-[10px] sm:text-xs text-purple-700 dark:text-purple-400 mb-2 font-semibold">Or share via:</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  onClick={() => shareVia('whatsapp')}
                  className="flex items-center space-x-1 bg-green-500 hover:bg-green-600 text-white px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>💬</span><span>WhatsApp</span>
                </button>
                <button
                  onClick={() => shareVia('telegram')}
                  className="flex items-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>✈️</span><span>Telegram</span>
                </button>
                <button
                  onClick={() => shareVia('email')}
                  className="flex items-center space-x-1 bg-gray-600 hover:bg-gray-700 text-white px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>📧</span><span>Email</span>
                </button>
                <button
                  onClick={() => shareVia('twitter')}
                  className="flex items-center space-x-1 bg-sky-500 hover:bg-sky-600 text-white px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>🐦</span><span>Twitter</span>
                </button>
              </div>
            </div>

            {/* Important Card */}
            <div className="bg-amber-50/50 dark:bg-amber-950/10 border-2 border-amber-200 dark:border-amber-900/50 rounded-xl p-3.5 sm:p-4">
              <div className="flex items-start space-x-2.5 sm:space-x-3">
                <svg className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-amber-800 dark:text-amber-400 text-xs sm:text-sm mb-0.5">Important</h4>
                  <p className="text-[11px] sm:text-xs text-amber-700 dark:text-amber-500 leading-normal">Share the invite link or credentials with the person you want to chat with. They can join instantly via the link!</p>
                </div>
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 sm:py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer"
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
