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

  const scrollDuration = 24 - (scrollSpeed * 2);
  
  // Debug
  console.log('Preview - Speed:', scrollSpeed, 'Duration:', scrollDuration);

  // Create animation styles directly
  const scrollTextKeyframes = `
    @keyframes previewScrollText {
      from { transform: translateX(100%) translateY(-50%); }
      to { transform: translateX(-100%) translateY(-50%); }
    }
  `;
  
  const animationStyle = {
    animation: `previewScrollText ${scrollDuration}s linear infinite`,
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    color: textColor,
    fontSize: fontSize,
    lineHeight: '0.8',
    left: 0,
    top: '50%',
    width: 'max-content'
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "w-full h-20 overflow-hidden border rounded-md relative",
        isEmergency && "animate-flash"
      )}
      style={{ backgroundColor }}
    >
      <style dangerouslySetInnerHTML={{ __html: scrollTextKeyframes }} />
      <div className="relative w-full h-full overflow-hidden">
        <div 
          className={cn(
            fontClasses[font],
            isParty && "animate-flash"
          )}
          style={animationStyle}
        >
          {displayText}
        </div>
      </div>
    </div>
  );
};

export default TextPreview;
