import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useTheme } from '../contexts/ThemeContext';
import { useLanguage, Language } from '../contexts/LanguageContext';
import { usePremium } from '../contexts/PremiumContext';

interface SettingsProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const Settings: React.FC<SettingsProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const { tier, features, isPremium } = usePremium();
  const navigate = useNavigate();

  const [screenshotDetection, setScreenshotDetection] = useState(() => localStorage.getItem('screenshot_detection') === 'true');
  const [readReceipts, setReadReceipts] = useState(() => localStorage.getItem('read_receipts') !== 'false');
  const [typingIndicators, setTypingIndicators] = useState(() => localStorage.getItem('typing_indicators') !== 'false');

  const toggleScreenshotDetection = () => {
    if (!isPremium) return;
    const next = !screenshotDetection;
    setScreenshotDetection(next);
    localStorage.setItem('screenshot_detection', String(next));
  };

  const toggleReadReceipts = () => {
    const next = !readReceipts;
    setReadReceipts(next);
    localStorage.setItem('read_receipts', String(next));
  };

  const toggleTypingIndicators = () => {
    const next = !typingIndicators;
    setTypingIndicators(next);
    localStorage.setItem('typing_indicators', String(next));
  };

  const languages: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' }
  ];

  const planLabels: Record<string, { icon: string; name: string; color: string }> = {
    free: { icon: '🆓', name: 'Free Plan', color: 'text-gray-600' },
    premium: { icon: '💎', name: 'Premium Plan', color: 'text-purple-600' },
    enterprise: { icon: '🏢', name: 'Enterprise Plan', color: 'text-blue-600' }
  };

  const plan = planLabels[tier];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-pink-50 to-blue-50 dark:from-slate-950 dark:via-purple-950/10 dark:to-slate-950 flex flex-col relative overflow-hidden">
      {/* Dynamic Background Blobs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-300/20 dark:bg-purple-900/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-1/4 w-[500px] h-[500px] bg-pink-300/20 dark:bg-pink-900/10 rounded-full blur-3xl -z-10 pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

      <Navbar />
      
      <div className="flex-1 py-12 px-4 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-8">Settings</h1>

          {/* Current Plan */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 mb-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{plan.icon}</span>
                  <h2 className={`text-2xl font-extrabold ${plan.color} dark:text-white tracking-tight`}>
                    {plan.name}
                  </h2>
                </div>
                {isPremium ? (
                  <p className="text-gray-600 dark:text-gray-300 text-sm font-medium">
                    {features.maxFileSize}MB files • {features.sessionDuration}h sessions • {features.adFree ? 'Ad-free' : ''} 
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                    5MB files • 1h sessions • With ads
                  </p>
                )}
              </div>
              {!isPremium && (
                <button
                  onClick={() => navigate('/premium')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-purple-500/20"
                >
                  💎 Upgrade Plan
                </button>
              )}
            </div>

            {isPremium && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100/50 dark:border-purple-900/30 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Files</p>
                  <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400">{features.maxFileSize}MB</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100/50 dark:border-purple-900/30 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Sessions</p>
                  <p className="text-lg font-extrabold text-purple-600 dark:text-purple-400">{features.sessionDuration}h</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100/50 dark:border-purple-900/30 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Ad-Free</p>
                  <p className="text-lg font-extrabold text-green-600">✓</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-950/40 border border-purple-100/50 dark:border-purple-900/30 rounded-xl p-3 text-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Calls</p>
                  <p className="text-lg font-extrabold text-green-600">{features.voiceCalls ? '✓' : '✗'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Settings */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Appearance</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Theme Mode
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'auto'] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`py-3 px-4 rounded-xl font-bold transition-all border ${
                        theme === t
                          ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20 border-transparent hover:scale-[1.01]'
                          : 'bg-gray-50/50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50'
                      }`}
                    >
                      {t === 'light' && '☀️ Light'}
                      {t === 'dark' && '🌙 Dark'}
                      {t === 'auto' && '🔄 Auto'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Color Scheme {!isPremium && <span className="text-purple-500">(Premium)</span>}
                </label>
                <div className="grid grid-cols-5 gap-3">
                  {(['purple', 'blue', 'green', 'orange', 'pink'] as const).map((color) => (
                    <button
                      key={color}
                      onClick={() => isPremium && setColorScheme(color)}
                      disabled={!isPremium}
                      className={`h-12 rounded-xl transition-all ${
                        colorScheme === color ? 'ring-4 ring-offset-2 ring-purple-400 scale-105 shadow-lg' : ''
                      } ${!isPremium ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer shadow-md'}`}
                      style={{
                        background: color === 'purple' ? '#a855f7' :
                                  color === 'blue' ? '#3b82f6' :
                                  color === 'green' ? '#10b981' :
                                  color === 'orange' ? '#f97316' : '#ec4899'
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Language Settings */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center space-x-2 border ${
                    language === lang.code
                      ? 'bg-purple-500 text-white border-transparent shadow-md shadow-purple-500/20 hover:scale-[1.01]'
                      : 'bg-gray-50/50 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300 border-gray-200/50 dark:border-gray-700/30 hover:bg-gray-100/80 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Privacy & Security</h2>
            <div className="space-y-1">
              {/* Read Receipts */}
              <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700/50">
                <div>
                  <h3 className="font-bold text-gray-850 dark:text-white">Read Receipts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Let others see when you've read messages</p>
                </div>
                <button
                  onClick={toggleReadReceipts}
                  className={`w-12 h-7 rounded-full transition-colors relative ${readReceipts ? 'bg-purple-500 shadow-md shadow-purple-500/20' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${readReceipts ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Typing Indicators */}
              <div className="flex items-center justify-between py-4">
                <div>
                  <h3 className="font-bold text-gray-850 dark:text-white">Typing Indicators</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Show when you're typing</p>
                </div>
                <button
                  onClick={toggleTypingIndicators}
                  className={`w-12 h-7 rounded-full transition-colors relative ${typingIndicators ? 'bg-purple-500 shadow-md shadow-purple-500/20' : 'bg-gray-200 dark:bg-gray-700'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${typingIndicators ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Screenshot Detection is now free and active by default */}
            </div>
          </div>

          {/* Data & Storage */}
          <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-gray-100 dark:border-gray-700/50 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Data & Storage</h2>
            <div className="space-y-3">
              <button 
                onClick={() => { localStorage.clear(); alert('Cache cleared!'); }}
                className="w-full text-left py-4 px-4 bg-gray-50/50 dark:bg-gray-900/30 border border-gray-200/50 dark:border-gray-700/30 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all hover:scale-[1.005]"
              >
                <h3 className="font-bold text-gray-800 dark:text-white">Clear Cache</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Remove temporary files</p>
              </button>
              
              <button 
                onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.reload(); }}
                className="w-full text-left py-4 px-4 bg-red-500/5 dark:bg-red-500/10 border border-red-500/20 rounded-xl hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all hover:scale-[1.005]"
              >
                <h3 className="font-bold text-red-650 dark:text-red-400">Clear All Data</h3>
                <p className="text-sm text-red-500 font-medium">Delete all local data and reset app</p>
              </button>
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

export default Settings;
