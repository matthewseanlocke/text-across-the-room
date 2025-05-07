
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
    preset 
  } = useTextDisplay();

  const [fontSize, setFontSize] = useState('');
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);

  // Update font size based on container size
  useEffect(() => {
    const updateFontSize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const containerHeight = containerRef.current.clientHeight;
        
        if (isLandscape) {
          // For landscape: 120% of container height (reduced from 150%)
          setFontSize(`${containerHeight * 1.2}px`);
        } else {
          // For portrait: 80% of container height (reduced from 100%)
          setFontSize(`${containerHeight * 0.8}px`);
        }
      }
    };
    
    updateFontSize();
    
    const resizeObserver = new ResizeObserver(() => {
      updateFontSize();
    });
    
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    
    window.addEventListener('resize', updateFontSize);
    
    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
      window.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape]);

  const displayText = text || "Preview text";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  
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

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full h-28 overflow-hidden border rounded-md relative",
        isEmergency && "animate-flash"
      )}
      style={{ 
        backgroundColor,
        '--scroll-duration': `${30 - scrollSpeed}s`
      } as React.CSSProperties}
    >
      <div className={cn(
        isLandscape 
          ? "whitespace-nowrap absolute animate-scroll-x w-full text-center" 
          : "absolute animate-scroll-y w-full text-center",
        isParty && "animate-flash",
        fontClasses[font]
      )}
      style={{ 
        color: textColor,
        fontSize: fontSize,
        lineHeight: '0.8'
      }}
      >
        {isLandscape ? (
          // For landscape: display text that takes full width
          <span className="inline-block w-full">{displayText}</span>
        ) : (
          // For portrait: each character on its own line with spaces between words
          <div className="flex flex-col items-center">
            {portraitChars.map((char, index) => (
              <div key={index} className="my-0">{char === ' ' ? '\u00A0' : char}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextPreview;
