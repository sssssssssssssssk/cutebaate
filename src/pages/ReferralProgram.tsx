import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

interface ReferralProgramProps {
  onTermsClick: () => void;
  onPrivacyClick: () => void;
  onReportClick: () => void;
}

const ReferralProgram: React.FC<ReferralProgramProps> = ({ onTermsClick, onPrivacyClick, onReportClick }) => {
  const [referralCode, setReferralCode] = useState('');
  const [referralStats, setReferralStats] = useState({
    totalReferrals: 0,
    premiumDaysEarned: 0,
    pendingRewards: 0
  });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate or load referral code
    let code = localStorage.getItem('referral_code');
    if (!code) {
      code = generateReferralCode();
      localStorage.setItem('referral_code', code);
    }
    setReferralCode(code);

    // Load stats
    const stats = JSON.parse(localStorage.getItem('referral_stats') || '{"totalReferrals":0,"premiumDaysEarned":0,"pendingRewards":0}');
    setReferralStats(stats);
  }, []);

  const generateReferralCode = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  const getReferralLink = (): string => {
    return `${window.location.origin}?ref=${referralCode}`;
  };

  const copyReferralLink = () => {
    navigator.clipboard.writeText(getReferralLink());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnSocial = (platform: string) => {
    const link = getReferralLink();
    const text = 'Join me on SecureChat - Anonymous encrypted messaging! Use my referral link:';
    
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(link)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + link)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(link)}&text=${encodeURIComponent(text)}`
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'width=600,height=400');
    }
  };

  const rewards = [
    { referrals: 1, reward: '3 days Premium', icon: '🥉', earned: referralStats.totalReferrals >= 1 },
    { referrals: 5, reward: '1 week Premium', icon: '🥈', earned: referralStats.totalReferrals >= 5 },
    { referrals: 10, reward: '1 month Premium', icon: '🥇', earned: referralStats.totalReferrals >= 10 },
    { referrals: 25, reward: '3 months Premium', icon: '💎', earned: referralStats.totalReferrals >= 25 },
    { referrals: 50, reward: '1 year Premium FREE', icon: '👑', earned: referralStats.totalReferrals >= 50 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Referral Program 🎁
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Invite friends and earn FREE Premium access!
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl mb-2">👥</div>
              <div className="text-3xl font-bold text-purple-600 mb-1">
                {referralStats.totalReferrals}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Referrals</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl mb-2">⭐</div>
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {referralStats.premiumDaysEarned}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Premium Days Earned</div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl text-center">
              <div className="text-4xl mb-2">🎁</div>
              <div className="text-3xl font-bold text-green-600 mb-1">
                {referralStats.pendingRewards}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending Rewards</div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              Your Referral Link
            </h2>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Referral Code:
                </span>
                <span className="text-2xl font-mono font-bold text-purple-600">
                  {referralCode}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={getReferralLink()}
                  readOnly
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white font-mono text-sm"
                />
                <button
                  onClick={copyReferralLink}
                  className="bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors font-semibold"
                >
                  {copied ? '✓ Copied!' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Social Sharing */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">Share on:</p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => shareOnSocial('twitter')}
                  className="flex items-center space-x-2 bg-blue-400 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </button>
                <button
                  onClick={() => shareOnSocial('facebook')}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </button>
                <button
                  onClick={() => shareOnSocial('whatsapp')}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => shareOnSocial('telegram')}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <span>✈️</span>
                  <span>Telegram</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rewards Tiers */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
              Rewards Tiers
            </h2>

            <div className="space-y-4">
              {rewards.map((reward, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-4 rounded-xl transition-all ${
                    reward.earned
                      ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500'
                      : 'bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-4xl">{reward.icon}</div>
                    <div>
                      <div className="font-bold text-gray-800 dark:text-white">
                        {reward.referrals} Referrals
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {reward.reward}
                      </div>
                    </div>
                  </div>
                  {reward.earned ? (
                    <div className="text-green-600 font-bold flex items-center space-x-2">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>Earned!</span>
                    </div>
                  ) : (
                    <div className="text-gray-400 dark:text-gray-500">
                      {referralStats.totalReferrals}/{reward.referrals}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* How it Works */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-2xl font-bold mb-6">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-5xl mb-3">1️⃣</div>
                <h3 className="font-bold mb-2">Share Your Link</h3>
                <p className="text-sm opacity-90">
                  Copy your unique referral link and share with friends
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">2️⃣</div>
                <h3 className="font-bold mb-2">Friends Sign Up</h3>
                <p className="text-sm opacity-90">
                  When they create their first session, you both get rewards
                </p>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-3">3️⃣</div>
                <h3 className="font-bold mb-2">Earn Premium</h3>
                <p className="text-sm opacity-90">
                  Get free Premium days for each successful referral
                </p>
              </div>
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

export default ReferralProgram;
