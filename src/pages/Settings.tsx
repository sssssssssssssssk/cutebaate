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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">Settings</h1>

          {/* Current Plan */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-2xl">{plan.icon}</span>
                  <h2 className={`text-2xl font-bold ${plan.color} dark:text-white`}>
                    {plan.name}
                  </h2>
                </div>
                {isPremium ? (
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {features.maxFileSize}MB files • {features.sessionDuration}h sessions • {features.adFree ? 'Ad-free' : ''} 
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    5MB files • 1h sessions • With ads
                  </p>
                )}
              </div>
              {!isPremium && (
                <button
                  onClick={() => navigate('/premium')}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all shadow-lg"
                >
                  💎 Upgrade Plan
                </button>
              )}
            </div>

            {isPremium && (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Files</p>
                  <p className="text-lg font-bold text-purple-600">{features.maxFileSize}MB</p>
                </div>
                <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Sessions</p>
                  <p className="text-lg font-bold text-purple-600">{features.sessionDuration}h</p>
                </div>
                <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Ad-Free</p>
                  <p className="text-lg font-bold text-green-600">✓</p>
                </div>
                <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Calls</p>
                  <p className="text-lg font-bold text-green-600">{features.voiceCalls ? '✓' : '✗'}</p>
                </div>
              </div>
            )}
          </div>

          {/* Theme Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
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
                      className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                        theme === t
                          ? 'bg-purple-500 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
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
                      className={`h-12 rounded-lg transition-all ${
                        colorScheme === color ? 'ring-4 ring-offset-2 ring-purple-400' : ''
                      } ${!isPremium ? 'opacity-40 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'}`}
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
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Language</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${
                    language === lang.code
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{lang.flag}</span>
                  <span>{lang.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Privacy & Security</h2>
            <div className="space-y-1">
              {/* Read Receipts */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Read Receipts</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Let others see when you've read messages</p>
                </div>
                <button
                  onClick={toggleReadReceipts}
                  className={`w-12 h-7 rounded-full transition-colors relative ${readReceipts ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${readReceipts ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Typing Indicators */}
              <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Typing Indicators</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Show when you're typing</p>
                </div>
                <button
                  onClick={toggleTypingIndicators}
                  className={`w-12 h-7 rounded-full transition-colors relative ${typingIndicators ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${typingIndicators ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Screenshot Detection */}
              <div className="flex items-center justify-between py-3">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">Screenshot Detection</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Alert when screenshots are taken
                    {!isPremium && <span className="text-purple-500 ml-1">(Premium)</span>}
                  </p>
                </div>
                <button
                  onClick={toggleScreenshotDetection}
                  disabled={!isPremium}
                  className={`w-12 h-7 rounded-full transition-colors relative ${
                    !isPremium ? 'bg-gray-200 dark:bg-gray-700 opacity-50 cursor-not-allowed' :
                    screenshotDetection ? 'bg-purple-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform ${screenshotDetection ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* Data & Storage */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Data & Storage</h2>
            <div className="space-y-3">
              <button 
                onClick={() => { localStorage.clear(); alert('Cache cleared!'); }}
                className="w-full text-left py-3 px-4 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                <h3 className="font-semibold text-gray-800 dark:text-white">Clear Cache</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Remove temporary files</p>
              </button>
              
              <button 
                onClick={() => { localStorage.clear(); sessionStorage.clear(); window.location.reload(); }}
                className="w-full text-left py-3 px-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              >
                <h3 className="font-semibold text-red-600">Clear All Data</h3>
                <p className="text-sm text-red-500">Delete all local data and reset app</p>
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
