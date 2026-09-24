import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CookiePreferences {
  essential: boolean; // Always true
  functional: boolean;
  analytics: boolean;
  guidance: boolean;
}

interface CookieContextType {
  preferences: CookiePreferences;
  hasConsented: boolean;
  isModalOpen: boolean;
  acceptAll: () => void;
  acceptEssentialOnly: () => void;
  savePreferences: (newPrefs: Partial<CookiePreferences>) => void;
  openModal: () => void;
  closeModal: () => void;
  resetConsent: () => void;
}

const DEFAULT_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: true,
  analytics: true,
  guidance: true,
};

const ESSENTIAL_ONLY_PREFERENCES: CookiePreferences = {
  essential: true,
  functional: false,
  analytics: false,
  guidance: false,
};

const CookieContext = createContext<CookieContextType | undefined>(undefined);

const STORAGE_KEY = 'oaicc_cookie_consent_v1';

export const CookieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<CookiePreferences>(DEFAULT_PREFERENCES);
  const [hasConsented, setHasConsented] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          essential: true,
          functional: parsed.functional ?? true,
          analytics: parsed.analytics ?? false,
          guidance: parsed.guidance ?? true,
        });
        setHasConsented(true);
      }
    } catch {
      // Ignore storage errors
    }
  }, []);

  const acceptAll = () => {
    const allAccepted: CookiePreferences = {
      essential: true,
      functional: true,
      analytics: true,
      guidance: true,
    };
    setPreferences(allAccepted);
    setHasConsented(true);
    setIsModalOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allAccepted));
    } catch {
      // storage error
    }
  };

  const acceptEssentialOnly = () => {
    setPreferences(ESSENTIAL_ONLY_PREFERENCES);
    setHasConsented(true);
    setIsModalOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ESSENTIAL_ONLY_PREFERENCES));
    } catch {
      // storage error
    }
  };

  const savePreferences = (newPrefs: Partial<CookiePreferences>) => {
    const updated: CookiePreferences = {
      ...preferences,
      ...newPrefs,
      essential: true, // Always locked to true
    };
    setPreferences(updated);
    setHasConsented(true);
    setIsModalOpen(false);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // storage error
    }
  };

  const resetConsent = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // storage error
    }
    setHasConsented(false);
    setIsModalOpen(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <CookieContext.Provider
      value={{
        preferences,
        hasConsented,
        isModalOpen,
        acceptAll,
        acceptEssentialOnly,
        savePreferences,
        openModal,
        closeModal,
        resetConsent,
      }}
    >
      {children}
    </CookieContext.Provider>
  );
};

export const useCookies = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookies must be used within a CookieProvider');
  }
  return context;
};
