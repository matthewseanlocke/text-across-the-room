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
    setScrollSpeed,
    isLandscape,
    preset,
    isCapitalized,
    isRainbowText,
    dualTextMode,
    isRainbowBackground,
    isLightningMode
  } = useTextDisplay();
  
  const navigate = useNavigate();
  const processedText = isCapitalized ? text.toUpperCase() : text;
  const displayText = processedText || "";
  const isEmergency = preset === 'emergency';
  const isParty = preset === 'party';
  const isDisco = preset === 'disco' || isRainbowBackground;
  const isLightning = preset === 'lightning' || isLightningMode;
  
  const [fontSize, setFontSize] = useState('120vh');
  const containerRef = useRef<HTMLDivElement>(null);
  const [isContentReady, setIsContentReady] = useState(false);
  
  // Update when scrollSpeed changes
  const [currentScrollDuration, setCurrentScrollDuration] = useState(0);
  
  // Calculate scroll duration based on speed (1-9 range)
  // Speed 1 = slowest (16s), Speed 9 = fastest (2s)
  const scrollDuration = 18 - (scrollSpeed * 1.8);
  
  // Animation key to force reset on rotation
  const [animationKey, setAnimationKey] = useState(Date.now());
  
  // Swipe gesture tracking
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackTimeout, setFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Update duration when speed changes
  useEffect(() => {
    setCurrentScrollDuration(scrollDuration);
    
    // Debug
    console.log('Display - Speed updated:', scrollSpeed, 'New Duration:', scrollDuration);
  }, [scrollSpeed, scrollDuration]);

  // Update font size based on window size and reset animation
  useEffect(() => {
    const updateFontSize = () => {
      if (isLandscape) {
        setFontSize('120vh');
      } else {
        // For portrait mode, use smaller font size if dual text mode is enabled
        setFontSize(dualTextMode ? '60vh' : '120vh');
      }
      
      // Reset animations to ensure sync
      setAnimationKey(Date.now());
    };

    updateFontSize();
    window.addEventListener('resize', updateFontSize);
    
    return () => {
      window.removeEventListener('resize', updateFontSize);
    };
  }, [isLandscape, dualTextMode]);
  
  // Ensure animations and positioning are set up before showing content
  useEffect(() => {
    // Short delay to ensure proper positioning before revealing
    const timer = setTimeout(() => {
      setIsContentReady(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    
    const deltaX = touchX - touchStartX;
    const deltaY = touchY - touchStartY;
    
    // Only adjust speed if horizontal swipe is more significant than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 30) {
      const direction = deltaX > 0 ? 1 : -1; // Right = increase speed, Left = decrease speed
      const newSpeed = Math.min(Math.max(scrollSpeed + direction, 1), 9);
      
      if (newSpeed !== scrollSpeed) {
        setScrollSpeed(newSpeed);
        setTouchStartX(touchX);
        setTouchStartY(touchY);
        
        // Show feedback
        setShowFeedback(true);
        
        // Clear previous timeout
        if (feedbackTimeout) {
          clearTimeout(feedbackTimeout);
        }
        
        // Hide feedback after 1.5 seconds
        const timeout = setTimeout(() => {
          setShowFeedback(false);
        }, 1500);
        
        setFeedbackTimeout(timeout);
        
        // Reset animation to ensure sync when speed changes
        setAnimationKey(Date.now());
      }
    }
  };
  
  const handleTouchEnd = () => {
    setTouchStartX(null);
    setTouchStartY(null);
  };

  const fontClasses = {
    display: 'font-display',
    handwriting: 'font-handwriting',
    monospace: 'font-monospace',
    serif: 'font-serif',
  };
  
  // Create animation styles directly
  const scrollTextKeyframes = `
    @keyframes displayScrollText {
      from { transform: translateX(100vw) translateY(-50%); }
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
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `;
  
  const baseAnimationStyle = {
    animation: `displayScrollText ${currentScrollDuration}s linear infinite${isRainbowText ? ', rainbowText 2s linear infinite' : ''}`,
    position: 'absolute' as const,
    whiteSpace: 'nowrap' as const,
    color: isRainbowText ? undefined : textColor,
    fontSize: fontSize,
    lineHeight: "0.8",
    left: 0,
    width: 'max-content',
    opacity: isContentReady ? 1 : 0,
    transition: 'opacity 0.3s ease-in'
  };

  // Top text style (positioned at 25% from top)
  const topTextStyle = {
    ...baseAnimationStyle,
    top: '25%',
  };

  // Bottom text style (positioned at 75% from top)
  const bottomTextStyle = {
    ...baseAnimationStyle,
    top: '75%',
  };

  // Determine container style based on effects
  const containerStyle = {
    backgroundColor: isRainbowBackground ? undefined : backgroundColor,
    animation: isRainbowBackground 
      ? 'rainbowBackground 2s linear infinite' 
      : isLightning 
        ? 'lightningFlash 3s linear infinite' 
        : undefined
  };
  
  // Only render text content if there is text to display
  const renderTextContent = displayText.trim().length > 0;

  return (
    <div 
      ref={containerRef}
      className={cn(
        "fixed inset-0 flex items-center justify-center overflow-hidden animate-fade-in",
        isEmergency && "animate-flash"
      )}
      style={containerStyle}
      onClick={() => {
        // Navigate back to options page without resetting scroll
        navigate('/options', { replace: true });
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <style dangerouslySetInnerHTML={{ __html: scrollTextKeyframes }} />
      <div className="relative w-full h-full overflow-hidden">
        {renderTextContent && isLandscape ? (
          // Landscape mode - show one text centered vertically
          <div 
            key={`landscape-${animationKey}`}
            className={cn(
              fontClasses[font],
              isParty && "animate-flash"
            )}
            style={{
              ...baseAnimationStyle,
              top: '50%'
            }}
          >
            {displayText}
          </div>
        ) : renderTextContent && !isLandscape ? (
          // Portrait mode - show one or two rows of text based on dualTextMode setting
          dualTextMode ? (
            // Dual text mode - show two rows of text with synchronized animations
            <div key={`portrait-dual-${animationKey}`}>
              <div 
                className={cn(
                  fontClasses[font],
                  isParty && "animate-flash"
                )}
                style={topTextStyle}
              >
                {displayText}
              </div>
              <div 
                className={cn(
                  fontClasses[font],
                  isParty && "animate-flash"
                )}
                style={bottomTextStyle}
              >
                {displayText}
              </div>
            </div>
          ) : (
            // Single text mode - show one text centered vertically
            <div 
              key={`portrait-single-${animationKey}`}
              className={cn(
                fontClasses[font],
                isParty && "animate-flash"
              )}
              style={{
                ...baseAnimationStyle,
                top: '50%'
              }}
            >
              {displayText}
            </div>
          )
        ) : null /* No text to display */}
      </div>
      
      {/* Speed change feedback */}
      {showFeedback && (
        <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-black/70 text-white px-6 py-3 rounded-full flex items-center space-x-4">
            <div className="text-sm">Speed: {scrollSpeed}</div>
            <div className="w-32 h-2 bg-white/30 rounded-full">
              <div 
                className="h-full bg-white rounded-full"
                style={{ width: `${(scrollSpeed - 1) / 8 * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayText;
