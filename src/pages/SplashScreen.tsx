import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTextDisplay } from '@/context/TextDisplayContext';
import AppLogo from '@/components/AppLogo';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTextDisplay();
  const [isFadingOut, setIsFadingOut] = useState(false);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDismissing = useRef(false);

  const dismissSplash = useCallback(() => {
    if (isDismissing.current) return;
    isDismissing.current = true;
    setIsFadingOut(true);
    navigationTimer.current = setTimeout(() => navigate('/options'), 350);
  }, [navigate]);
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    return () => {
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
    };
  }, [darkMode]);
  
  // Ensure full rerender by forcing component rerender
  useEffect(() => {
    document.title = "text-across-the-room";
  }, []);
  
  return (
    <div 
      className={`splash-screen flex flex-col items-center justify-center bg-background dark:bg-gray-900 transition-colors duration-200 ${
        isFadingOut ? 'animate-fade-out' : ''
      }`}
      role="button"
      tabIndex={0}
      aria-label="Continue to Text Across the Room"
      onClick={dismissSplash}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          dismissSplash();
        }
      }}
    >
      <div className="w-full max-w-[40rem] px-4">
        <AppLogo size="large" showAnimation={true} meta={<div className="splash-version">v{__APP_VERSION__}</div>} />
      </div>

      <a
        className="coffee-button splash-coffee"
        href="https://buymeacoffee.com/matthewseanwallace"
        target="_blank"
        rel="noreferrer"
        aria-label="Buy me a coffee"
        title="Buy me a coffee"
        onClick={(event) => event.stopPropagation()}
      >
        <span className="coffee-cup" aria-hidden="true" />
      </a>
      
      <style>
        {`
          .splash-version {
            margin-top: 12px;
            margin-bottom: 12px;
            color: #64748b;
            font-size: 11px;
            font-weight: 700;
            letter-spacing: .08em;
            text-align: center;
            text-transform: uppercase;
          }
          .dark .splash-version { color: #94a3b8; }
          .splash-screen {
            position: relative;
            width: 100%;
            height: 100vh;
            height: 100dvh;
            min-height: 100svh;
            overflow: hidden;
            cursor: pointer;
          }
          .splash-coffee {
            position: absolute;
            left: max(18px, env(safe-area-inset-left));
            bottom: max(18px, env(safe-area-inset-bottom));
            z-index: 2;
            cursor: pointer;
          }
          
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .animate-fade-out {
            animation: fadeOut 0.35s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen;
