
import React, { useEffect, useState } from 'react';
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
    preset 
  } = useTextDisplay();
  
  const navigate = useNavigate();
  const displayText = text || "Hello from across the room!";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  
  const [fontSize, setFontSize] = useState(isLandscape ? '80vw' : '80vw');

  // Update font size based on window size
  useEffect(() => {
    const updateFontSize = () => {
      const size = isLandscape ? '80vw' : '80vw';
      setFontSize(size);
    };

    // Initial size
    updateFontSize();

    // Add event listener
    window.addEventListener('resize', updateFontSize);
    
    // Clean up
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

  // For portrait mode, split the text into words and then characters
  const words = displayText.split(' ');
  const portraitChars = [];
  
  // Process words to add spaces between them
  words.forEach((word, wordIndex) => {
    // Add each character of the word
    word.split('').forEach((char, charIndex) => {
      portraitChars.push(char);
    });
    
    // Add a space character between words (except after the last word)
    if (wordIndex < words.length - 1) {
      portraitChars.push(' ');
    }
  });

  // Lock orientation to stay active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Prevent screen from dimming/sleeping
        try {
          // @ts-ignore - TypeScript doesn't know about this API yet
          if (navigator.wakeLock) {
            // @ts-ignore
            navigator.wakeLock.request('screen').catch(err => {
              console.log('Wake Lock error:', err);
            });
          }
        } catch (err) {
          console.log('Wake Lock API not supported', err);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    handleVisibilityChange();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <div 
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden",
        isEmergency && "animate-flash"
      )}
      style={{ 
        backgroundColor,
        '--scroll-duration': `${30 - scrollSpeed}s`
      } as React.CSSProperties}
      onClick={() => navigate('/')}
    >
      <div className={cn(
        "absolute",
        isLandscape 
          ? "animate-scroll-x whitespace-nowrap w-full text-center" 
          : "animate-scroll-y flex flex-col items-center w-full",
        isParty && "animate-flash",
        fontClasses[font]
      )}
      style={{ 
        color: textColor,
        fontSize: fontSize,
        lineHeight: "0.8"
      }}
      >
        {isLandscape ? (
          // For landscape: single line of text that takes full width
          <span className="inline-block w-full">{displayText}</span>
        ) : (
          // For portrait: each character on its own line with spaces between words
          <>
            {portraitChars.map((char, index) => (
              <div key={index} className="my-0">{char === ' ' ? '\u00A0' : char}</div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default DisplayText;
