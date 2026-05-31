import React from 'react';
import { generateSessionId, generatePassword } from '../utils/sessionUtils';
import { Session } from '../types';

interface GroupChatCreateProps {
  onSessionCreated: (session: Session) => void;
}

const GroupChatCreate: React.FC<GroupChatCreateProps> = ({ onSessionCreated }) => {
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
      isGroup: true
    }));
    return `${window.location.origin}/join/${payload}`;
  };

  const shareVia = (platform: string) => {
    const link = getInviteLink();
    const text = '🔒 Join my secure group chat on SecureChat!';
    const urls: Record<string, string> = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + '\n' + link)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`,
      email: `mailto:?subject=${encodeURIComponent('SecureChat Group Invite')}&body=${encodeURIComponent(text + '\n\n' + link)}`,
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
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-1">Create Group Chat</h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400">Generate a group session and invite members</p>
        </div>

        {!session ? (
          <button
            onClick={createNewSession}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3.5 sm:py-4 rounded-xl font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer"
          >
            Generate Group Session
          </button>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {/* Group Session ID */}
            <div className="bg-gray-50 dark:bg-zinc-800/40 rounded-xl p-3.5 sm:p-4 border-2 border-gray-200 dark:border-zinc-700/80">
              <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300 mb-1.5 block">Group Session ID</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={session.sessionId}
                  readOnly
                  className="flex-1 min-w-0 bg-white dark:bg-zinc-950 dark:text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg border border-gray-300 dark:border-zinc-700 font-mono text-sm sm:text-base focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(session.sessionId, 'id')}
                  className="bg-blue-500 text-white p-2.5 sm:p-3 rounded-lg hover:bg-blue-600 active:scale-90 transition-all flex-shrink-0 cursor-pointer"
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
                  className="bg-cyan-500 text-white p-2.5 sm:p-3 rounded-lg hover:bg-cyan-600 active:scale-90 transition-all flex-shrink-0 cursor-pointer"
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
            <div className="bg-gradient-to-r from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-3.5 sm:p-4 border-2 border-blue-200 dark:border-blue-900/50">
              <label className="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300 mb-1.5 block flex items-center space-x-2">
                <span>🔗</span>
                <span>Invite Link — Share with Group Members!</span>
              </label>
              <div className="flex items-center space-x-2 mb-3">
                <input
                  type="text"
                  value={getInviteLink()}
                  readOnly
                  className="flex-1 min-w-0 bg-white dark:bg-zinc-950 dark:text-white px-3 py-2 rounded-lg border border-blue-300 dark:border-blue-800 font-mono text-[10px] text-gray-700 dark:text-zinc-300 truncate focus:outline-none"
                />
                <button
                  onClick={() => copyToClipboard(getInviteLink(), 'link')}
                  className="bg-blue-500 text-white px-3.5 py-2 rounded-lg hover:bg-blue-600 transition-colors text-xs sm:text-sm font-semibold flex-shrink-0 cursor-pointer"
                >
                  {copied.link ? '✓ Copied' : 'Copy'}
                </button>
              </div>
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
              </div>
            </div>

            {/* Group Chat Features Info */}
            <div className="bg-blue-50/50 dark:bg-blue-950/10 border-2 border-blue-200 dark:border-blue-900/50 rounded-xl p-3.5 sm:p-4">
              <div className="flex items-start space-x-2.5 sm:space-x-3">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-blue-800 dark:text-blue-400 text-xs sm:text-sm mb-0.5">Group Chat Features</h4>
                  <ul className="text-[11px] sm:text-xs text-blue-700 dark:text-blue-500 leading-normal space-y-0.5">
                    <li>• Members join instantly via the invite link</li>
                    <li>• You'll receive join requests to approve</li>
                    <li>• Control who participates in your group</li>
                    <li>• All messages remain encrypted</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              onClick={startSession}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3.5 sm:py-4 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-600 transition-all transform hover:scale-[1.02] active:scale-95 shadow-lg cursor-pointer"
            >
              Start Group Chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChatCreate;
