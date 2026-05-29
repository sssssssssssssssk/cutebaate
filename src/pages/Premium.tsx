import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { usePremium } from '../contexts/PremiumContext';

interface PremiumProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const Premium: React.FC<PremiumProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const { tier, upgradeToPremium, upgradeToEnterprise, cancelPremium } = usePremium();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />

      <div className="flex-1 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-10">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-3">
              SecureChat <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Premium</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Unlock the full power of encrypted communication
            </p>
            {tier !== 'free' && (
              <div className="mt-4 inline-flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-full font-semibold">
                <span>✨</span>
                <span>You're on the {tier.charAt(0).toUpperCase() + tier.slice(1)} plan</span>
              </div>
            )}
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {/* Free */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 ${tier === 'free' ? 'border-gray-400' : 'border-transparent'}`}>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🆓</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Free</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">$0</span>
                  <span className="text-gray-500">/forever</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>E2E Encryption (AES-256)</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>5MB file uploads</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>1 hour sessions</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Text, stickers & reactions</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Voice messages</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Reply, edit, pin, delete</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Self-destruct messages</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Typing indicators & read receipts</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Message search & formatting</span></li>
                <li className="flex items-center space-x-2 text-gray-500"><span>✗</span><span>Contains ads</span></li>
              </ul>
              {tier === 'free' ? (
                <div className="text-center text-sm text-gray-500 font-semibold py-3 border-2 border-gray-300 rounded-xl">Current Plan</div>
              ) : (
                <button onClick={cancelPremium} className="w-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">Downgrade</button>
              )}
            </div>

            {/* Premium */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border-2 relative transform md:scale-105 ${tier === 'premium' ? 'border-purple-500' : 'border-purple-200 dark:border-purple-800'}`}>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                ⭐ MOST POPULAR
              </div>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">💎</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Premium</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-purple-600">$4.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Everything in Free</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>Ad-free experience</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>24 hour sessions</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>50MB file uploads</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>Custom session URLs</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>Priority connection speed</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>Session history (7 days encrypted)</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>Custom themes & wallpapers</span></li>
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>Voice & video calls (E2E)</span></li>
              </ul>
              {tier === 'premium' ? (
                <div className="text-center text-purple-600 font-bold py-3 border-2 border-purple-500 rounded-xl">✨ Active</div>
              ) : (
                <button onClick={upgradeToPremium} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg">
                  Upgrade to Premium
                </button>
              )}
            </div>

            {/* Enterprise */}
            <div className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 ${tier === 'enterprise' ? 'border-blue-500' : 'border-transparent'}`}>
              <div className="text-center mb-6">
                <div className="text-4xl mb-3">🏢</div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Enterprise</h3>
                <div className="mt-2">
                  <span className="text-4xl font-bold text-blue-600">$14.99</span>
                  <span className="text-gray-500">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Everything in Premium</span></li>
                <li className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-semibold"><span>🚀</span><span>500MB file uploads</span></li>
                <li className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-semibold"><span>🚀</span><span>1 week long sessions</span></li>
                <li className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-semibold"><span>🚀</span><span>Screen sharing</span></li>
                <li className="flex items-center space-x-2 text-blue-700 dark:text-blue-300 font-semibold"><span>🚀</span><span>Priority support</span></li>
              </ul>
              {tier === 'enterprise' ? (
                <div className="text-center text-blue-600 font-bold py-3 border-2 border-blue-500 rounded-xl">🚀 Active</div>
              ) : (
                <button onClick={upgradeToEnterprise} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg">
                  Upgrade to Enterprise
                </button>
              )}
            </div>
          </div>

          {/* Feature Comparison Table */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden mb-10">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Feature Comparison</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="text-left px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold">Feature</th>
                    <th className="text-center px-6 py-3 text-gray-600 dark:text-gray-300 font-semibold">Free</th>
                    <th className="text-center px-6 py-3 text-purple-600 font-semibold">Premium</th>
                    <th className="text-center px-6 py-3 text-blue-600 font-semibold">Enterprise</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {[
                    ['E2E Encryption', '✓', '✓', '✓'],
                    ['Message Reactions', '✓', '✓', '✓'],
                    ['Reply / Quote', '✓', '✓', '✓'],
                    ['Edit Messages (5 min)', '✓', '✓', '✓'],
                    ['Delete for Everyone', '✓', '✓', '✓'],
                    ['Pin Messages', '✓', '✓', '✓'],
                    ['Typing Indicators', '✓', '✓', '✓'],
                    ['Read Receipts', '✓', '✓', '✓'],
                    ['Voice Messages', '✓', '✓', '✓'],
                    ['Message Search', '✓', '✓', '✓'],
                    ['Bold / Italic / Code', '✓', '✓', '✓'],
                    ['Self-Destruct Messages', '✓', '✓', '✓'],
                    ['Stickers & GIFs', '✓', '✓', '✓'],
                    ['Max File Size', '5MB', '50MB', '500MB'],
                    ['Session Duration', '1 hour', '24 hours', '1 week'],
                    ['Ad-Free', '✗', '✓', '✓'],
                    ['Custom Themes', '✗', '✓', '✓'],
                    ['Custom Session URLs', '✗', '✓', '✓'],
                    ['Priority Speed', '✗', '✓', '✓'],
                    ['Session History', '✗', '7 days', '7 days'],
                    ['Voice / Video Calls', '✗', '✓', '✓'],
                    ['Screen Sharing', '✗', '✗', '✓'],
                  ].map(([feature, free, premium, enterprise], i) => (
                    <tr key={i} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                      <td className="px-6 py-3 text-gray-800 dark:text-gray-200 font-medium">{feature}</td>
                      <td className="px-6 py-3 text-center">{free === '✓' ? <span className="text-green-500 font-bold">✓</span> : free === '✗' ? <span className="text-gray-400">✗</span> : <span className="text-gray-700 dark:text-gray-300">{free}</span>}</td>
                      <td className="px-6 py-3 text-center">{premium === '✓' ? <span className="text-purple-500 font-bold">✓</span> : premium === '✗' ? <span className="text-gray-400">✗</span> : <span className="text-purple-700 dark:text-purple-300 font-semibold">{premium}</span>}</td>
                      <td className="px-6 py-3 text-center">{enterprise === '✓' ? <span className="text-blue-500 font-bold">✓</span> : enterprise === '✗' ? <span className="text-gray-400">✗</span> : <span className="text-blue-700 dark:text-blue-300 font-semibold">{enterprise}</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* FAQ */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5 text-sm">
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Can I cancel anytime?</h4>
                <p className="text-gray-600 dark:text-gray-400">Yes! Cancel anytime. Your features remain active until the billing period ends.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Is my payment secure?</h4>
                <p className="text-gray-600 dark:text-gray-400">Payments are processed via secure gateways. We never store card details.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">What happens when my session expires?</h4>
                <p className="text-gray-600 dark:text-gray-400">Free users get 1-hour sessions. When time runs out, all data is permanently deleted. Upgrade for longer sessions.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 dark:text-white mb-1">Do free users get all message features?</h4>
                <p className="text-gray-600 dark:text-gray-400">Yes! Reactions, replies, edits, pins, voice messages, search, formatting, and self-destruct are all free.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer onTermsClick={onTermsClick} onPrivacyClick={onPrivacyClick} onReportClick={onReportClick} />
    </div>
  );
};

export default Premium;
