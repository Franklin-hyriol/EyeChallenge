'use client';

import React, { useState, useEffect } from 'react';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('cookieConsent')) {
      setShowBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 w-full bg-slate-100 dark:bg-slate-900/80 backdrop-blur-sm p-4 border-t border-slate-200 dark:border-slate-800 shadow-lg"
      id="cookie-banner"
    >
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-slate-700 dark:text-slate-300 text-center sm:text-left">
          Nous utilisons des cookies pour améliorer votre expérience. En continuant à utiliser notre site, vous acceptez
          notre utilisation des cookies.
        </p>
        <button
          className="flex-shrink-0 min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-md h-9 px-4 bg-primary text-slate-50 text-sm font-bold leading-normal tracking-[0.015em] hover:opacity-90 transition-opacity"
          id="accept-cookies"
          onClick={acceptCookies}
        >
          J'ai compris
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
