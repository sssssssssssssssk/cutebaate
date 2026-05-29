import React, { createContext, useContext, useState, useEffect } from 'react';

export type PremiumTier = 'free' | 'premium' | 'enterprise';

interface PremiumFeatures {
  adFree: boolean;
  longerSessions: boolean;
  largeFiles: boolean;
  customURL: boolean;
  prioritySpeed: boolean;
  sessionHistory: boolean;
  customThemes: boolean;
  voiceCalls: boolean;
  screenShare: boolean;
  maxFileSize: number;
  sessionDuration: number;
}

interface PremiumContextType {
  tier: PremiumTier;
  features: PremiumFeatures;
  upgradeToPremium: () => void;
  upgradeToEnterprise: () => void;
  cancelPremium: () => void;
  isPremium: boolean;
}

const premiumFeaturesByTier: Record<PremiumTier, PremiumFeatures> = {
  free: {
    adFree: false,
    longerSessions: false,
    largeFiles: false,
    customURL: false,
    prioritySpeed: false,
    sessionHistory: false,
    customThemes: false,
    voiceCalls: false,
    screenShare: false,
    maxFileSize: 5,
    sessionDuration: 1,
  },
  premium: {
    adFree: true,
    longerSessions: true,
    largeFiles: true,
    customURL: true,
    prioritySpeed: true,
    sessionHistory: true,
    customThemes: true,
    voiceCalls: true,
    screenShare: false,
    maxFileSize: 50,
    sessionDuration: 24,
  },
  enterprise: {
    adFree: true,
    longerSessions: true,
    largeFiles: true,
    customURL: true,
    prioritySpeed: true,
    sessionHistory: true,
    customThemes: true,
    voiceCalls: true,
    screenShare: true,
    maxFileSize: 500,
    sessionDuration: 168,
  },
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tier, setTier] = useState<PremiumTier>(() => {
    return (localStorage.getItem('premiumTier') as PremiumTier) || 'free';
  });

  useEffect(() => {
    localStorage.setItem('premiumTier', tier);
  }, [tier]);

  const upgradeToPremium = () => setTier('premium');
  const upgradeToEnterprise = () => setTier('enterprise');
  const cancelPremium = () => setTier('free');

  return (
    <PremiumContext.Provider
      value={{
        tier,
        features: premiumFeaturesByTier[tier],
        upgradeToPremium,
        upgradeToEnterprise,
        cancelPremium,
        isPremium: tier !== 'free',
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
};

export const usePremium = () => {
  const context = useContext(PremiumContext);
  if (!context) throw new Error('usePremium must be used within PremiumProvider');
  return context;
};
