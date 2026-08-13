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
  
  // Log when the splash screen renders
  useEffect(() => {
    console.log('SplashScreen rendered');
    
    // Apply dark mode to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Navigate to options screen after a delay
    const timer = setTimeout(dismissSplash, 2800);
    
    return () => {
      clearTimeout(timer);
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
    };
  }, [darkMode, dismissSplash]);
  
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
      <div className="animate-scale-in px-4">
        <AppLogo size="large" showAnimation={true} />
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
          @keyframes scaleIn {
            0% { opacity: 0; transform: scale(0.9); }
            30% { opacity: 1; transform: scale(1.1); }
            60% { transform: scale(0.95); }
            100% { transform: scale(1); }
          }
          .animate-scale-in {
            animation: scaleIn 1.2s ease-out forwards;
          }
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
