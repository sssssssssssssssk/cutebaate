import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InteractiveBackground from '../components/InteractiveBackground';
import { usePremium } from '../contexts/PremiumContext';
import { useRazorpay } from '../hooks/useRazorpay';

interface PremiumProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const Premium: React.FC<PremiumProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const { tier, upgradeToPremium, upgradeToEnterprise, cancelPremium } = usePremium();
  const { openCheckout } = useRazorpay();
  const navigate = useNavigate();

  const handleUpgradePayment = (planName: 'premium' | 'enterprise', priceInRupees: number) => {
    const keyId = localStorage.getItem('razorpay_key_id') || 'rzp_live_SxysR2d6LDQ7ee';
    
    const options = {
      key: keyId,
      amount: priceInRupees * 100, // amount in paise
      currency: 'INR',
      name: 'SecureChat Inc.',
      description: `Upgrade to ${planName.charAt(0).toUpperCase() + planName.slice(1)} Subscription`,
      image: 'https://cdn-icons-png.flaticon.com/512/3064/3064197.png',
      handler: function (response: any) {
        console.log('Payment Successful:', response);
        localStorage.setItem('razorpay_payment_id', response.razorpay_payment_id);
        
        if (planName === 'premium') {
          upgradeToPremium();
        } else {
          upgradeToEnterprise();
        }
        alert(`Payment Successful! Transaction ID: ${response.razorpay_payment_id}. Your account has been upgraded to ${planName.charAt(0).toUpperCase() + planName.slice(1)}.`);
      },
      prefill: {
        name: 'Anonymous Chat User',
        email: 'chat@securechat.io',
        contact: '9999999999'
      },
      notes: {
        plan: planName
      },
      theme: {
        color: planName === 'premium' ? '#a855f7' : '#3b82f6'
      }
    };

    openCheckout(options);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <InteractiveBackground />
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
                  <span className="text-4xl font-bold text-gray-800 dark:text-white">₹0</span>
                  <span className="text-gray-500">/forever</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8 text-sm">
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>E2E Encryption (AES-256)</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>P2P Voice & Video Calls (Free!)</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Screenshot Detection & Alerts</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>WhatsApp Message Deletion</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Anonymous Group Polls</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Group Roles & Admin Invites</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>5MB drag-and-drop uploads</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>1 hour sessions</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Swipe to Reply & Heart Reactions</span></li>
                <li className="flex items-center space-x-2 text-gray-700 dark:text-gray-300"><span>✓</span><span>Voice notes & formatting</span></li>
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
                  <span className="text-4xl font-bold text-purple-600">₹49</span>
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
                <li className="flex items-center space-x-2 text-purple-700 dark:text-purple-300 font-semibold"><span>✨</span><span>Gift Premium to chat partners</span></li>
              </ul>
              {tier === 'premium' ? (
                <div className="text-center text-purple-600 font-bold py-3 border-2 border-purple-500 rounded-xl">✨ Active</div>
              ) : (
                <button onClick={() => handleUpgradePayment('premium', 49)} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg">
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
                  <span className="text-4xl font-bold text-blue-600">₹99</span>
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
                <button onClick={() => handleUpgradePayment('enterprise', 99)} className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity shadow-lg">
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
                    ['P2P Voice & Video Calls', '✓', '✓', '✓'],
                    ['Screenshot Alerts', '✓', '✓', '✓'],
                    ['WhatsApp Date Dividers', '✓', '✓', '✓'],
                    ['WhatsApp Message Deletion', '✓', '✓', '✓'],
                    ['Anonymous Group Polls', '✓', '✓', '✓'],
                    ['Multi-Admin & Moderator Roles', '✓', '✓', '✓'],
                    ['Gift Premium & Confetti', '✓', '✓', '✓'],
                    ['Swipe to Reply & Haptics', '✓', '✓', '✓'],
                    ['Double-Tap Heart React', '✓', '✓', '✓'],
                    ['Camera & Photo Transfer', '✓', '✓', '✓'],
                    ['Emojis & Message Pinning', '✓', '✓', '✓'],
                    ['Edit Messages (5 min)', '✓', '✓', '✓'],
                    ['Typing Indicators & Receipts', '✓', '✓', '✓'],
                    ['Voice Messages & formatting', '✓', '✓', '✓'],
                    ['Self-Destruct Messages', '✓', '✓', '✓'],
                    ['Max File Size', '5MB', '50MB', '500MB'],
                    ['Session Duration', '1 hour', '24 hours', '1 week'],
                    ['Ad-Free', '✗', '✓', '✓'],
                    ['Custom Wallpapers & Themes', '✗', '✓', '✓'],
                    ['Custom Session URLs', '✗', '✓', '✓'],
                    ['Priority Speed', '✗', '✓', '✓'],
                    ['Session History', '✗', '7 days', '7 days'],
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
