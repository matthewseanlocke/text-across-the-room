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
    isCapitalized,
    isRainbowText
  } = useTextDisplay();

  const [fontSize, setFontSize] = useState('');
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Update when scrollSpeed changes
  const [currentScrollDuration, setCurrentScrollDuration] = useState(0);
  
  // Calculate scroll duration based on speed (1-9 range)
  // Speed 1 = slowest (16s), Speed 9 = fastest (2s)
  const scrollDuration = 18 - (scrollSpeed * 1.8);
  
  // Update duration when speed changes
  useEffect(() => {
    setCurrentScrollDuration(scrollDuration);
    
    // Debug
    console.log('Preview - Speed updated:', scrollSpeed, 'New Duration:', scrollDuration);
  }, [scrollSpeed, scrollDuration]);

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
  
  // Create animation styles directly
  const scrollTextKeyframes = `
    @keyframes previewScrollText {
      from { transform: translateX(100%) translateY(-50%); }
      to { transform: translateX(-100%) translateY(-50%); }
    }
    
    @keyframes rainbowText {
      0% { color: #ff0000; }
      16.6% { color: #ffff00; }
      33.3% { color: #00ff00; }
      50% { color: #00ffff; }
      66.6% { color: #0000ff; }
      83.3% { color: #ff00ff; }
      100% { color: #ff0000; }
    }
  `;
  
  const animationStyle = {
    animation: `previewScrollText ${currentScrollDuration}s linear infinite${isRainbowText ? ', rainbowText 2s linear infinite' : ''}`,
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    color: isRainbowText ? undefined : textColor,
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
