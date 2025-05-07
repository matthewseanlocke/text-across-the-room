
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
  // Apply capitalization if needed
  const processedText = isCapitalized ? text.toUpperCase() : text;
  const displayText = processedText || "HELLO";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  
  const [fontSize, setFontSize] = useState(isLandscape ? '120vh' : '95vw');
  const containerRef = useRef<HTMLDivElement>(null);

  // Update font size based on window size
  useEffect(() => {
    const updateFontSize = () => {
      if (isLandscape) {
        // For landscape: 120% of viewport height
        setFontSize('120vh');
      } else {
        // For portrait: 95% of viewport width to maximize character size
        setFontSize('95vw');
      }
    };

    // Initial size calculation
    updateFontSize();

    // Create a resize observer to detect container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateFontSize();
    });

    // Observe the container element
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    // Also listen for window resize events
    window.addEventListener('resize', updateFontSize);
    
    // Clean up
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      window.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape, displayText]);
  
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

  // Calculate scroll duration consistently for both orientations
  // Using a higher duration multiplier for portrait to slow it down
  const scrollDuration = isLandscape ? (30 - scrollSpeed) : (30 - scrollSpeed) * 3;

  // Force immediate rendering by using inline styles for animations
  const landscapeAnimationStyle = {
    animation: `scroll-x ${scrollDuration}s linear infinite`,
    paddingLeft: '100vw', 
    paddingRight: '100vw'
  };
  
  const portraitAnimationStyle = {
    animation: `scroll-y ${scrollDuration}s linear infinite`,
    paddingTop: '100vh',
    paddingBottom: '100vh'
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden",
        isEmergency && "animate-flash"
      )}
      style={{ 
        backgroundColor,
      }}
      onClick={() => navigate('/')}
    >
      <div className={cn(
        "absolute",
        isLandscape 
          ? "whitespace-nowrap w-full text-center" 
          : "w-full text-center",
        isParty && "animate-flash",
        fontClasses[font]
      )}
      style={{ 
        color: textColor,
        fontSize: fontSize,
        lineHeight: "0.8",
        ...(isLandscape ? landscapeAnimationStyle : {})
      }}
      >
        {isLandscape ? (
          // For landscape: single line of text that takes full width
          <span className="inline-block w-full">{displayText}</span>
        ) : (
          // For portrait: wrap all characters in a single container for consistent animation
          <div className="flex flex-col items-center" style={portraitAnimationStyle}>
            {portraitChars.map((char, index) => (
              <div key={index} className="my-0">{char === ' ' ? '\u00A0' : char}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayText;
