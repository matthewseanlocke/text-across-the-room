import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTextDisplay } from '@/context/TextDisplayContext';
import { cn } from '@/lib/utils';

const DisplayText: React.FC = () => {
  const { 
    text, 
    textColor, 
    backgroundColor, 
    font, 
    scrollSpeed, 
    isLandscape,
    preset,
    isCapitalized
  } = useTextDisplay();
  
  const navigate = useNavigate();
  const processedText = isCapitalized ? text.toUpperCase() : text;
  const displayText = processedText || "HELLO";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  
  const [fontSize, setFontSize] = useState('120vh');
  const containerRef = useRef<HTMLDivElement>(null);

  // Update font size based on window size
  useEffect(() => {
    const updateFontSize = () => {
      if (isLandscape) {
        setFontSize('120vh');
      } else {
        setFontSize('80vh');
      }
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape]);

  const fontClasses = {
    display: 'font-display',
    handwriting: 'font-handwriting',
    monospace: 'font-monospace',
    serif: 'font-serif',
  };

  // Calculate scroll duration based on speed
  const scrollDuration = (30 - scrollSpeed);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden",
        isEmergency && "animate-flash"
      )}
      style={{ backgroundColor }}
      onClick={() => navigate('/')}
    >
      <style>
        {`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-150%); }
          }
        `}
      </style>
      <div 
        className={cn(
          "absolute whitespace-nowrap text-center",
          isParty && "animate-flash",
          fontClasses[font]
        )}
        style={{ 
          color: textColor,
          fontSize: fontSize,
          lineHeight: "0.8",
          animation: `scrollText ${scrollDuration}s linear infinite`,
          left: '100%',
          width: 'max-content'
        }}
      >
        {displayText}
      </div>
    </div>
  );
};

export default DisplayText;
