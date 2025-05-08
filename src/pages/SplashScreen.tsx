import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTextDisplay } from '@/context/TextDisplayContext';
import AppLogo from '@/components/AppLogo';

const SplashScreen: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode } = useTextDisplay();
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  
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
    const timer = setTimeout(() => {
      console.log('Splash screen timer completed');
      // Start the fade out transition
      setIsFadingOut(true);
      
      // Navigate after the fade out animation completes
      setTimeout(() => {
        console.log('Navigating to options');
        navigate('/options');
      }, 400); // Faster fade out transition
      
      setIsLoading(false);
    }, 1800); // Reduced to 1.8 seconds for faster display
    
    return () => clearTimeout(timer);
  }, [navigate, darkMode]);
  
  // Ensure full rerender by forcing component rerender
  useEffect(() => {
    document.title = "text-across-the-room";
  }, []);
  
  return (
    <div 
      className={`min-h-screen flex flex-col items-center justify-center bg-background dark:bg-gray-900 transition-colors duration-200 ${
        isFadingOut ? 'animate-fade-out' : ''
      }`}
    >
      <div className="animate-scale-in px-4">
        <AppLogo size="large" showAnimation={isLoading} />
      </div>
      
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
          
          @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
          }
          .animate-fade-out {
            animation: fadeOut 0.4s ease-in-out forwards;
          }
        `}
      </style>
    </div>
  );
};

export default SplashScreen; 