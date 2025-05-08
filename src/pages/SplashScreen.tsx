import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTextDisplay } from '@/context/TextDisplayContext';

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
      <div className="text-center px-4">
        <div className="animate-scale-in">
          <h1 className="text-5xl font-bold mb-6 dark:text-white">
            text-across-the-room
          </h1>
        </div>
        
        {/* Loading indicator */}
        <div className="flex justify-center mt-4">
          <div className={`${isLoading ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-primary dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-3 h-3 bg-primary dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-3 h-3 bg-primary dark:bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
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
    </div>
  );
};

export default SplashScreen; 