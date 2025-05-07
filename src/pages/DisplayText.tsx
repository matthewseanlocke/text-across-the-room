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
        setFontSize('120vh');
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

  // Calculate scroll duration based on speed (1-9 range)
  // Speed 1 = slowest (20s), Speed 9 = fastest (4s)
  const scrollDuration = 24 - (scrollSpeed * 2);
  
  // Debug
  console.log('Display - Speed:', scrollSpeed, 'Duration:', scrollDuration);

  // Create animation styles directly
  const scrollTextKeyframes = `
    @keyframes displayScrollText {
      from { transform: translateX(100vw) translateY(-50%); }
      to { transform: translateX(-100%) translateY(-50%); }
    }
  `;
  
  const animationStyle = {
    animation: `displayScrollText ${scrollDuration}s linear infinite`,
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    color: textColor,
    fontSize: fontSize,
    lineHeight: "0.8",
    left: 0,
    top: '50%',
    width: 'max-content'
  };

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

export default DisplayText;
