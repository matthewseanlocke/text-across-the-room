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
    isRainbowText,
    isRainbowBackground,
    isLightningMode,
    isSirenMode,
    isHeartbeatMode
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
  // Remove default text
  const displayText = processedText || "";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  const isDisco = preset === 'disco' || isRainbowBackground;
  const isLightning = preset === 'lightning' || isLightningMode;
  const isSiren = preset === 'siren' || isSirenMode;
  const isHeartbeat = preset === 'heartbeat' || isHeartbeatMode;
  
  // Check if there's any text to display
  const hasText = displayText.trim().length > 0;
  
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
    
    @keyframes rainbowBackground {
      0% { background-color: #ff0000; }
      16.6% { background-color: #ffff00; }
      33.3% { background-color: #00ff00; }
      50% { background-color: #00ffff; }
      66.6% { background-color: #0000ff; }
      83.3% { background-color: #ff00ff; }
      100% { background-color: #ff0000; }
    }
    
    @keyframes lightningFlash {
      0%, 91%, 94%, 98% { background-color: #000000; }
      90%, 93%, 97%, 100% { background-color: #ffffff; }
    }
    
    @keyframes sirenFlash {
      0%, 15% { background-color: #0000ff; }
      15.1%, 17% { background-color: #ffffff; }
      17.1%, 35% { background-color: #0000ff; }
      35.1%, 40% { background-color: #000000; }
      
      40.1%, 55% { background-color: #ff0000; }
      55.1%, 57% { background-color: #ffffff; }
      57.1%, 75% { background-color: #ff0000; }
      75.1%, 80% { background-color: #000000; }
      
      80.1%, 82% { background-color: #ffffff; }
      82.1%, 100% { background-color: #000000; }
    }
    
    @keyframes heartbeatPulse {
      0%, 100% { background-color: #800000; transform: scale(1); }
      15% { background-color: #ff0000; transform: scale(1.08); }
      30% { background-color: #800000; transform: scale(1); }
      45% { background-color: #ff0000; transform: scale(1.08); }
      60% { background-color: #800000; transform: scale(1); }
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
    width: 'max-content',
    zIndex: 10
  };

  // Get contrasting text color for the watermark based on background
  const getContrastColor = (bgColor: string) => {
    // Simple version - for black/dark backgrounds use very light gray, for all others use very dark gray
    const darkColors = ['#000000', '#0000ff', '#000080', '#800000'];
    return darkColors.includes(bgColor) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
  };

  const watermarkColor = getContrastColor(backgroundColor);
  
  // Determine container style based on effects
  const containerStyle = {
    backgroundColor: isRainbowBackground ? undefined : backgroundColor,
    animation: isRainbowBackground 
      ? 'rainbowBackground 2s linear infinite' 
      : isLightning 
        ? 'lightningFlash 3s linear infinite' 
        : isSiren
          ? 'sirenFlash 0.6s linear infinite'
          : isHeartbeat
            ? 'heartbeatPulse 1.5s ease-in-out infinite'
            : undefined
  };

  return (
    <div className="w-full h-20 rounded-lg overflow-hidden border relative" ref={containerRef}>
      <style dangerouslySetInnerHTML={{ __html: scrollTextKeyframes }} />
      
      <div
        className={cn(
          "absolute inset-0 flex items-center justify-center",
          isEmergency && "animate-flash"
        )}
        style={containerStyle}
      >
        {/* Watermark "Preview" text */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span 
            className="text-3xl font-bold tracking-wider uppercase"
            style={{ color: watermarkColor }}
          >
            Preview
          </span>
        </div>
        
        {/* Only render text if there is any */}
        {hasText && (
          <div 
            className={cn(
              fontClasses[font],
              isParty && "animate-flash"
            )}
            style={animationStyle}
          >
            {displayText}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextPreview;
