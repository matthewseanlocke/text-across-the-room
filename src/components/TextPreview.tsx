import React, { useState, useEffect, useRef } from 'react';
import { useTextDisplay } from '@/context/TextDisplayContext';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

const TextPreview: React.FC = () => {
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

  const [fontSize, setFontSize] = useState('');
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Update font size based on container size
  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const containerHeight = containerRef.current.clientHeight;
        setFontSize(`${containerHeight * 1.2}px`);
      }
    };
    
    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape]);

  const processedText = isCapitalized ? text.toUpperCase() : text;
  const displayText = processedText || "HELLO";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  
  const fontClasses = {
    display: 'font-display',
    handwriting: 'font-handwriting',
    monospace: 'font-monospace',
    serif: 'font-serif',
  };

  const scrollDuration = (30 - scrollSpeed);

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full h-20 overflow-hidden border rounded-md relative",
        isEmergency && "animate-flash"
      )}
      style={{ backgroundColor }}
    >
      <style>
        {`
          @keyframes scrollText {
            0% { transform: translateX(100%); }
            100% { transform: translateX(-200%); }
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
          lineHeight: '0.8',
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

export default TextPreview;
